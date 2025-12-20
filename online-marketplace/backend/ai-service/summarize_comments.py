#!/usr/bin/env python3
"""
AI Comment Summarization Service
Using spaCy (Industry-grade NLP) for high-quality extractive summarization
Falls back to sumy (TextRank) and intelligent analysis if needed
"""

import sys
import json
import re


def summarize_with_spacy(comments_text, sentences_count=2):
    """
    Summarize comments using spaCy's advanced NLP capabilities
    Uses dependency parsing, sentence scoring, and entity recognition
    
    Args:
        comments_text: List of comment strings or a single string
        sentences_count: Number of sentences to extract (default: 2)
    
    Returns:
        str: Summarized text
    """
    try:
        import spacy
        
        # Load spaCy model (try en_core_web_sm first, fallback to others)
        nlp = None
        for model_name in ['en_core_web_sm', 'en_core_web_md', 'en']:
            try:
                nlp = spacy.load(model_name)
                break
            except OSError:
                continue
        
        if nlp is None:
            raise ImportError("spaCy English model not found. Install with: python -m spacy download en_core_web_sm")
        
        # Prepare input text (handle both old format and new format with ratings)
        if isinstance(comments_text, list):
            if len(comments_text) > 0 and isinstance(comments_text[0], dict):
                comments = [c.get('text', str(c)).strip() for c in comments_text if c and c.get('text')]
            else:
                comments = [str(c).strip() for c in comments_text if c and str(c).strip()]
        else:
            comments = [str(comments_text).strip()]
        
        if not comments:
            return "No comments available to summarize."
        
        # Single comment - return as is (or shortened if too long)
        if len(comments) == 1:
            comment = comments[0]
            if len(comment) > 200:
                doc = nlp(comment)
                sentences = [sent.text.strip() for sent in doc.sents]
                summary = ". ".join(sentences[:2]).strip()
                return summary + "." if summary else comment[:200] + "..."
            return comment
        
        # Check if comments are too short for NLP processing
        avg_length = sum(len(c) for c in comments) / len(comments)
        if avg_length < 15:
            return summarize_fallback(comments_text)
        
        # Combine all comments
        combined_text = " ".join(comments)
        combined_text = re.sub(r'\s+', ' ', combined_text).strip()
        
        # Process with spaCy
        doc = nlp(combined_text)
        
        # Extract all sentences
        sentences = [sent.text.strip() for sent in doc.sents if sent.text.strip()]
        
        if not sentences:
            return summarize_fallback(comments_text)
        
        # Score sentences based on multiple factors
        sentence_scores = []
        
        # Keywords related to product reviews
        important_keywords = {
            'quality', 'delivery', 'shipping', 'price', 'value', 'worth', 'recommend',
            'excellent', 'great', 'good', 'amazing', 'perfect', 'love', 'satisfied',
            'problem', 'issue', 'disappointed', 'late', 'slow', 'fast', 'quick',
            'broken', 'defective', 'material', 'durable', 'packaging', 'service'
        }
        
        for i, sent in enumerate(sentences):
            score = 0.0
            sent_doc = nlp(sent)
            sent_lower = sent.lower()
            
            # 1. Keyword density (important words in product reviews)
            keyword_count = sum(1 for word in important_keywords if word in sent_lower)
            score += keyword_count * 2.0
            
            # 2. Sentence length (prefer medium-length sentences, not too short or too long)
            word_count = len([token for token in sent_doc if not token.is_punct and not token.is_space])
            if 8 <= word_count <= 25:
                score += 1.5
            elif 5 <= word_count <= 30:
                score += 1.0
            
            # 3. Named entities (sentences with entities are often more informative)
            entity_count = len(sent_doc.ents)
            score += entity_count * 1.0
            
            # 4. Verb presence (sentences with verbs are more complete)
            verb_count = len([token for token in sent_doc if token.pos_ == "VERB"])
            if verb_count > 0:
                score += 1.0
            
            # 5. Position (slightly favor earlier sentences, but not too much)
            position_factor = 1.0 - (i / len(sentences)) * 0.2
            score *= position_factor
            
            # 6. Sentiment indicators
            positive_words = ['excellent', 'great', 'good', 'amazing', 'perfect', 'love', 'satisfied', 'recommend']
            negative_words = ['problem', 'issue', 'disappointed', 'late', 'slow', 'broken', 'defective']
            
            if any(word in sent_lower for word in positive_words):
                score += 1.5
            if any(word in sent_lower for word in negative_words):
                score += 1.5  # Also important to capture negative feedback
            
            # 7. Avoid very short sentences (less than 5 words)
            if word_count < 5:
                score *= 0.5
            
            sentence_scores.append((score, sent, i))
        
        # Sort by score (descending)
        sentence_scores.sort(key=lambda x: x[0], reverse=True)
        
        # Determine number of sentences to extract
        if len(sentences) <= 3:
            sentences_to_extract = 1
        elif len(sentences) <= 6:
            sentences_to_extract = 2
        else:
            sentences_to_extract = min(3, sentences_count)
        
        # Get top sentences (maintain original order if possible)
        selected = sentence_scores[:sentences_to_extract]
        selected.sort(key=lambda x: x[2])  # Sort by original position
        
        summary = ". ".join([sent for _, sent, _ in selected])
        summary = summary.strip()
        
        # Clean up
        if not summary or len(summary) < 20:
            return summarize_fallback(comments_text)
        
        # Ensure proper ending
        if not summary.endswith(('.', '!', '?')):
            summary += "."
        
        return summary
        
    except ImportError as e:
        print(f"spaCy import error: {str(e)}", file=sys.stderr, flush=True)
        return summarize_fallback(comments_text)
    except Exception as e:
        print(f"Error with spaCy: {str(e)}", file=sys.stderr, flush=True)
        return summarize_fallback(comments_text)

def summarize_with_sumy(comments_text, sentences_count=2):
    """
    Summarize comments using sumy's TextRank algorithm
    Extracts the most representative sentences from the reviews
    
    Args:
        comments_text: List of comment strings or a single string
        sentences_count: Number of sentences to extract (default: 2)
    
    Returns:
        str: Summarized text
    """
    try:
        from sumy.parsers.plaintext import PlaintextParser
        from sumy.nlp.tokenizers import Tokenizer
        from sumy.summarizers.text_rank import TextRankSummarizer
        
        # Prepare input text (handle both old format and new format with ratings)
        if isinstance(comments_text, list):
            if len(comments_text) > 0 and isinstance(comments_text[0], dict):
                comments = [c.get('text', str(c)).strip() for c in comments_text if c and c.get('text')]
            else:
                comments = [str(c).strip() for c in comments_text if c and str(c).strip()]
        else:
            comments = [str(comments_text).strip()]
        
        if not comments:
            return "No comments available to summarize."
        
        # Single comment - return as is (or shortened if too long)
        if len(comments) == 1:
            comment = comments[0]
            if len(comment) > 200:
                # Split into sentences and take first 2
                sentences = re.split(r'[.!?]+', comment)
                summary = ". ".join([s.strip() for s in sentences[:2] if s.strip()])
                return summary + "." if summary else comment[:200] + "..."
            return comment
        
        # Check if comments are too short for TextRank (single words/phrases)
        avg_length = sum(len(c) for c in comments) / len(comments)
        if avg_length < 20:
            # Use intelligent fallback for very short comments
            return summarize_fallback(comments_text)
        
        # Combine all comments into a single text
        combined_text = " ".join(comments)
        
        # Clean up the text
        combined_text = re.sub(r'\s+', ' ', combined_text).strip()
        
        # Use sumy's TextRank summarizer
        parser = PlaintextParser.from_string(combined_text, Tokenizer("english"))
        summarizer = TextRankSummarizer()
        
        # Determine number of sentences to extract (adaptive based on comment count)
        if len(comments) <= 3:
            sentences_to_extract = 1
        elif len(comments) <= 6:
            sentences_to_extract = 2
        else:
            sentences_to_extract = min(3, sentences_count)
        
        # Generate summary
        summary_sentences = summarizer(parser.document, sentences_to_extract)
        summary = " ".join(str(sentence) for sentence in summary_sentences)
        
        # Clean up the summary
        summary = summary.strip()
        
        # If summary is too short or empty, use fallback
        if len(summary) < 20:
            return summarize_fallback(comments_text)
        
        return summary
        
    except ImportError:
        # Fallback if sumy not installed
        return summarize_fallback(comments_text)
    except Exception as e:
        print(f"Error with sumy: {str(e)}", file=sys.stderr, flush=True)
        return summarize_fallback(comments_text)


def summarize_with_gensim(comments_text):
    """
    Alternative: Use Gensim summarization (lighter than sumy)
    """
    try:
        from gensim.summarization import summarize
        
        if isinstance(comments_text, list):
            text = " ".join([str(c).strip() for c in comments_text if c and str(c).strip()])
        else:
            text = str(comments_text).strip()
        
        if not text or len(text) < 100:
            return summarize_fallback(comments_text)
        
        # Gensim works better with longer text
        summary = summarize(text, ratio=0.3, word_count=50)
        
        if summary and len(summary.strip()) > 20:
            return summary.strip()
        else:
            return summarize_fallback(comments_text)
            
    except ImportError:
        return summarize_fallback(comments_text)
    except Exception as e:
        print(f"Error with gensim: {str(e)}", file=sys.stderr, flush=True)
        return summarize_fallback(comments_text)


def analyze_sentiment_with_ratings(comments_data):
    """
    Analyze sentiment from comments and ratings
    Returns: (positive_count, negative_count, avg_rating, sentiment_ratio)
    """
    if isinstance(comments_data, list) and len(comments_data) > 0:
        # Check if comments_data contains dicts with text and rating
        if isinstance(comments_data[0], dict):
            comments = [c.get('text', str(c)) for c in comments_data]
            ratings = [c.get('rating') for c in comments_data if c.get('rating') is not None]
        else:
            comments = [str(c).strip() for c in comments_data if c and str(c).strip()]
            ratings = []
    else:
        comments = [str(comments_data).strip()] if comments_data else []
        ratings = []
    
    all_text = " ".join(comments).lower()
    
    # Enhanced negative word detection
    positive_words = ['good', 'great', 'excellent', 'amazing', 'love', 'perfect', 'wonderful', 
                     'awesome', 'fantastic', 'best', 'nice', 'happy', 'satisfied', 'recommend', 
                     'fast', 'quick', 'easy', 'beautiful', 'quality', 'worth', 'lovely', 'gamed',
                     'exceeded', 'outstanding', 'brilliant', 'superb', 'pleased', 'impressed']
    
    negative_words = ['bad', 'poor', 'terrible', 'awful', 'worst', 'slow', 'difficult', 
                     'problem', 'issue', 'disappointed', 'broken', 'wrong', 'waste', 'late',
                     'horrible', 'disappointing', 'unhappy', 'complaint', 'defective', 'damaged',
                     'faulty', 'useless', 'rubbish', 'garbage', 'regret', 'refund', 'return']
    
    # Count sentiment words
    positive_count = sum(1 for word in positive_words if word in all_text)
    negative_count = sum(1 for word in negative_words if word in all_text)
    
    # Use ratings if available (1-2 stars = negative, 3 = neutral, 4-5 = positive)
    if ratings:
        rating_negative = sum(1 for r in ratings if r and r <= 2)
        rating_positive = sum(1 for r in ratings if r and r >= 4)
        avg_rating = sum(ratings) / len(ratings) if ratings else None
        
        # Combine text sentiment with rating sentiment (ratings are more reliable)
        positive_count = positive_count + (rating_positive * 2)  # Weight ratings more
        negative_count = negative_count + (rating_negative * 2)   # Weight ratings more
    else:
        avg_rating = None
    
    total_sentiment = positive_count + negative_count
    sentiment_ratio = 0.5
    if total_sentiment > 0:
        sentiment_ratio = positive_count / (positive_count + negative_count)
    
    return positive_count, negative_count, avg_rating, sentiment_ratio, comments


def summarize_fallback(comments_text):
    """
    Fallback summarization using intelligent analysis
    Enhanced to better detect and represent negative reviews
    """
    if not comments_text:
        return "No comments available to summarize."
    
    # Parse comments (handle both old format and new format with ratings)
    if isinstance(comments_text, list) and len(comments_text) > 0:
        if isinstance(comments_text[0], dict):
            comments_data = comments_text
            comments = [c.get('text', str(c)) for c in comments_data]
        else:
            comments_data = [{'text': str(c), 'rating': None} for c in comments_text]
            comments = [str(c).strip() for c in comments_text if c and str(c).strip()]
    else:
        comments_data = [{'text': str(comments_text), 'rating': None}]
        comments = [str(comments_text).strip()]
    
    if not comments:
        return "No comments available to summarize."
    
    # Single comment
    if len(comments) == 1:
        comment = comments[0]
        if len(comment) > 150:
            sentences = re.split(r'[.!?]+', comment)
            summary = ". ".join(sentences[:2]).strip()
            return summary + "." if summary else comment[:150] + "..."
        return comment
    
    # Analyze sentiment with ratings
    positive_count, negative_count, avg_rating, sentiment_ratio, comments = analyze_sentiment_with_ratings(comments_data)
    
    all_text = " ".join(comments).lower()
    
    # Count low ratings (1-2 stars) and high ratings (4-5 stars)
    ratings = [c.get('rating') for c in comments_data if isinstance(c, dict) and c.get('rating') is not None]
    low_ratings = [r for r in ratings if r and r <= 2]
    high_ratings = [r for r in ratings if r and r >= 4]
    
    # Determine sentiment - prioritize negative if there are low ratings
    if avg_rating is not None:
        # Check for significant negative presence
        if len(low_ratings) >= len(high_ratings) and len(low_ratings) > 0:
            # Negative reviews are equal or more than positive
            if avg_rating <= 2.0:
                sentiment = "Buyers reported significant issues"
            elif avg_rating <= 2.5:
                sentiment = "Many buyers were dissatisfied"
            elif avg_rating <= 3.0:
                sentiment = "Several buyers reported concerns"
            else:
                sentiment = "Buyers had mixed experiences with some reporting issues"
        elif avg_rating <= 2.5:
            sentiment = "Many buyers were dissatisfied"
        elif avg_rating <= 3.0:
            sentiment = "Buyers had mixed experiences"
        elif avg_rating <= 3.5:
            sentiment = "Buyers generally had positive experiences"
        elif avg_rating <= 4.0:
            sentiment = "Most buyers were satisfied"
        else:
            sentiment = "Most buyers were very satisfied"
    else:
        # Fall back to text sentiment
        if negative_count > positive_count:
            if sentiment_ratio <= 0.3:
                sentiment = "Many buyers reported issues"
            else:
                sentiment = "Some buyers reported significant concerns"
        elif sentiment_ratio <= 0.4:
            sentiment = "Some buyers reported concerns"
        elif sentiment_ratio <= 0.5:
            sentiment = "Buyers had mixed experiences"
        elif sentiment_ratio <= 0.6:
            sentiment = "Buyers generally had positive experiences"
        elif sentiment_ratio <= 0.75:
            sentiment = "Most buyers were satisfied"
        else:
            sentiment = "Most buyers were very satisfied"
    
    # Extract specific negative issues mentioned
    negative_issues = []
    if 'late' in all_text or 'slow' in all_text:
        negative_issues.append("delivery delays")
    if any(word in all_text for word in ['bad quality', 'poor quality', 'defective', 'broken', 'damaged']):
        negative_issues.append("quality issues")
    if any(word in all_text for word in ['wrong', 'incorrect', 'not as described']):
        negative_issues.append("product mismatch")
    
    # Extract positive aspects
    positive_aspects = []
    if any(word in all_text for word in ['fast', 'quick']) and 'late' not in all_text:
        positive_aspects.append("fast delivery")
    if any(word in all_text for word in ['quality', 'durable', 'well-made']) and 'bad quality' not in all_text:
        positive_aspects.append("product quality")
    
    # Build summary - prioritize negative if present
    has_low_ratings = len(low_ratings) > 0
    has_high_ratings = len(high_ratings) > 0
    
    if (negative_count > positive_count) or (has_low_ratings and len(low_ratings) >= len(high_ratings)) or (avg_rating and avg_rating <= 2.5):
        # Negative-dominant summary
        if negative_issues:
            summary = f"{sentiment}. {', '.join(negative_issues[:2]).capitalize()} were frequently mentioned."
        elif has_low_ratings:
            # Extract actual negative comments
            negative_comments = [c.get('text', '') for c in comments_data if isinstance(c, dict) and c.get('rating') and c.get('rating') <= 2]
            if negative_comments:
                # Use the most descriptive negative comment
                longest_negative = max(negative_comments, key=len)
                if len(longest_negative) > 10:
                    summary = f"{sentiment}. Buyers mentioned: \"{longest_negative}\"."
                else:
                    summary = f"{sentiment} with this product."
            else:
                summary = f"{sentiment} with this product."
        else:
            summary = f"{sentiment} with this product."
        if not summary.endswith("."):
            summary += "."
        summary += " Potential buyers should consider these concerns."
    elif negative_count > 0 or has_low_ratings or (avg_rating and avg_rating <= 3.5):
        # Mixed summary - mention both positive and negative
        parts = []
        if negative_issues:
            parts.append(f"some concerns about {negative_issues[0]}")
        elif has_low_ratings:
            parts.append("some reported issues")
        if positive_aspects:
            parts.append(f"positive feedback on {positive_aspects[0]}")
        if parts:
            summary = f"{sentiment}. {', '.join(parts).capitalize()}."
        else:
            summary = f"{sentiment} about this product."
    else:
        # Positive summary
        if positive_aspects:
            summary = f"{sentiment} with the {', '.join(positive_aspects[:2])}."
        else:
            summary = f"{sentiment} about this product."
    
    # Add recommendation or warning (only if not already added)
    if not summary.endswith("consider these concerns."):
        if (sentiment_ratio >= 0.75 or (avg_rating and avg_rating >= 4.5)) and positive_count > 2 and not has_low_ratings:
            summary += " Overall, buyers highly recommend this product."
        elif (negative_count > positive_count or has_low_ratings or (avg_rating and avg_rating <= 2.5)) and not summary.endswith("consider these concerns."):
            summary += " Several concerns were raised that potential buyers should carefully consider."
    
    return summary


def main():
    """Main function to handle command-line input"""
    try:
        # Read input from stdin (JSON format)
        input_data = json.load(sys.stdin)
        comments = input_data.get('comments', [])
        
        if not comments:
            result = {
                'success': True,
                'summary': 'No comments available to summarize.'
            }
            print(json.dumps(result), flush=True)
            return
        
        # Try spaCy first (best quality), then sumy, then fallback
        # Note: spaCy may have compatibility issues with Python 3.14+
        summary = None
        try:
            summary = summarize_with_spacy(comments)
        except (ImportError, OSError, Exception) as e1:
            # spaCy failed (likely Python 3.14 compatibility issue)
            # Silently fall back to sumy
            try:
                summary = summarize_with_sumy(comments)
            except Exception as e2:
                print(f"sumy failed: {str(e2)}", file=sys.stderr, flush=True)
                summary = summarize_fallback(comments)
        
        # Output JSON result
        result = {
            'success': True,
            'summary': summary
        }
        print(json.dumps(result), flush=True)
        
    except json.JSONDecodeError:
        # If input is not JSON, try reading as plain text
        try:
            sys.stdin.seek(0)
            comments = sys.stdin.read().strip().split('\n')
            try:
                summary = summarize_with_spacy(comments)
            except:
                try:
                    summary = summarize_with_sumy(comments)
                except:
                    summary = summarize_fallback(comments)
            result = {
                'success': True,
                'summary': summary
            }
            print(json.dumps(result), flush=True)
        except Exception as e2:
            error_result = {
                'success': False,
                'error': str(e2),
                'summary': 'Unable to generate summary at this time.'
            }
            print(json.dumps(error_result), flush=True)
            sys.exit(1)
    except Exception as e:
        error_result = {
            'success': False,
            'error': str(e),
            'summary': 'Unable to generate summary at this time.'
        }
        print(json.dumps(error_result), flush=True)
        sys.exit(1)


if __name__ == '__main__':
    main()
