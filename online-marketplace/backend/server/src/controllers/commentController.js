const commentService = require('../services/commentService');
const { success, error } = require('../utils/response');
const { spawn } = require('child_process');
const path = require('path');

exports.addComment = async (req, res) => {
  try {
    // JWT token contains 'id', not '_id'
    const buyerId = req.user.id || req.user._id;
    if (!buyerId) {
      return error(res, 'Buyer ID not found in token', 401);
    }
    const { itemId, text, rating, orderId } = req.body;
    const comment = await commentService.addComment({ buyerId, itemId, text, rating, orderId });
    success(res, comment, 201);
  } catch (err) { error(res, err.message, 400); }
};

exports.getCommentsByItemId = async (req, res) => {
  try {
    const { itemId } = req.params;
    const comments = await commentService.getCommentsByItemId(itemId);
    success(res, comments);
  } catch (err) { error(res, err.message, 400); }
};

exports.getCommentsSummary = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    // Get all comment texts for this item
    const commentsText = await commentService.getCommentsTextForSummarization(itemId);
    
    if (!commentsText || commentsText.length === 0) {
      return success(res, { 
        summary: 'No comments available to summarize.',
        commentCount: 0 
      });
    }
    
    // Path to Python script
    // From: backend/server/src/controllers/
    // To: backend/ai-service/summarize_comments.py
    const pythonScriptPath = path.join(__dirname, '../../../ai-service/summarize_comments.py');
    
    // Spawn Python process
    const python = spawn('python', [pythonScriptPath]);
    
    // Prepare input data (commentsText is now array of {text, rating} objects)
    const inputData = JSON.stringify({ comments: commentsText });
    
    let summaryResult = '';
    let errorOutput = '';
    let responseSent = false;
    
    // Helper function to send response (prevent multiple sends)
    const sendResponse = (data) => {
      if (!responseSent) {
        responseSent = true;
        success(res, data);
      }
    };
    
    // Handle stdout (this is where the JSON result comes from)
    python.stdout.on('data', (data) => {
      summaryResult += data.toString();
    });
    
    // Handle stderr (warnings/info messages - not necessarily errors)
    python.stderr.on('data', (data) => {
      const stderrText = data.toString();
      errorOutput += stderrText;
      // Log warnings but don't treat them as fatal errors
      // Transformers library outputs many warnings to stderr that are harmless
      if (stderrText.includes('Error') || stderrText.includes('Exception') || stderrText.includes('Traceback')) {
        console.error('Python stderr (potential error):', stderrText);
      } else {
        // Just log as info - these are usually warnings
        console.log('Python stderr (info/warning):', stderrText.substring(0, 200));
      }
    });
    
    // Handle process completion
    python.on('close', (code) => {
      // Check if we got output first, regardless of exit code
      // Sometimes Python exits with non-zero but still produces valid output
      if (summaryResult.trim()) {
        try {
          // Try to extract JSON from the output (might have extra text)
          // Look for JSON object in the output
          const jsonMatch = summaryResult.match(/\{[\s\S]*\}/);
          const jsonStr = jsonMatch ? jsonMatch[0] : summaryResult.trim();
          
          const result = JSON.parse(jsonStr);
          
          if (result.success && result.summary) {
            console.log('✅ Successfully generated summary');
            return sendResponse({
              summary: result.summary,
              commentCount: commentsText.length
            });
          } else if (result.summary) {
            // Has summary but success might be false - still use it
            console.log('⚠️ Summary generated but success=false');
            return sendResponse({
              summary: result.summary,
              commentCount: commentsText.length
            });
          }
        } catch (parseError) {
          console.error('❌ Error parsing Python JSON output:', parseError.message);
          console.error('Raw stdout:', summaryResult);
          console.error('Raw stderr:', errorOutput.substring(0, 500));
        }
      }
      
      // If we get here, something went wrong
      if (code !== 0) {
        console.error('❌ Python process exited with code:', code);
        console.error('Error output:', errorOutput.substring(0, 500));
      } else {
        console.error('⚠️ Python exited successfully but no valid output received');
        console.error('Stdout:', summaryResult.substring(0, 500));
      }
      
      // Return fallback summary
      sendResponse({
        summary: 'Unable to generate AI summary at this time. Please read the individual reviews below.',
        commentCount: commentsText.length,
        error: 'Summarization service unavailable'
      });
    });
    
    // Handle process errors (e.g., Python not found)
    python.on('error', (err) => {
      console.error('❌ Failed to start Python process:', err);
      sendResponse({
        summary: `Failed to start Python: ${err.message}. Please ensure Python 3.8+ is installed.`,
        commentCount: commentsText.length,
        error: 'Python process error'
      });
    });
    
    // Send input to Python process
    python.stdin.write(inputData);
    python.stdin.end();
    
    // Set timeout (5 minutes for first-time model download, 2 minutes for subsequent runs)
    // First time can take 5+ minutes to download the model
    setTimeout(() => {
      if (!python.killed && !responseSent) {
        python.kill();
        console.error('⏱️ Summary generation timed out after 5 minutes');
        sendResponse({
          summary: 'Summary generation is taking longer than expected. This may be the first time loading the AI model (which can take 5-10 minutes). Please try again in a few minutes, or read the individual reviews below.',
          commentCount: commentsText.length,
          error: 'Timeout'
        });
      }
    }, 300000); // 5 minutes = 300,000 milliseconds
    
  } catch (err) {
    console.error('❌ Error generating summary:', err);
    error(res, err.message, 500);
  }
};