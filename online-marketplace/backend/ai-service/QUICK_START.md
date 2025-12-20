# AI Comment Summarization - Quick Start Guide

## Setup (One-time)

### Windows:
```bash
cd online-marketplace/backend/ai-service
setup.bat
```

### Linux/Mac:
```bash
cd online-marketplace/backend/ai-service
chmod +x setup.sh
./setup.sh
```

### Manual Setup:
```bash
cd online-marketplace/backend/ai-service
pip install -r requirements.txt
```

## How It Works

1. **Buyers leave comments/reviews** on products
2. **Click "View AI Summary"** button on product detail page
3. **AI analyzes all comments** and generates a concise summary
4. **Summary displays** highlighting key points from reviews

## Example Summary

Input (Multiple Reviews):
- "Great product! Fast delivery and excellent quality."
- "Love it! The seller responded quickly to my questions."
- "Good value for money. Would buy again."
- "Some issues with packaging but product itself is fine."

Output (AI Summary):
"Most buyers appreciated the product quality, fast delivery, and responsive seller service. The product offers good value, though some mentioned minor packaging concerns."

## Technical Details

- **Model**: Facebook BART-large-CNN (primary) or DistilBART-CNN (fallback)
- **Technology**: Hugging Face Transformers
- **Language**: Python 3.8+
- **Integration**: Node.js backend calls Python service via subprocess

## Troubleshooting

### "Python not found" error
- Install Python 3.8+ from https://www.python.org/
- Make sure Python is in your system PATH

### "Model download fails"
- Check internet connection
- The first run downloads ~1.5GB model files
- Ensure sufficient disk space

### "Summary generation timeout"
- Large number of comments may take longer
- Try with fewer comments first
- Check Python process is running

### "Module not found" errors
- Run `pip install -r requirements.txt` again
- Use `pip3` instead of `pip` if needed

## API Endpoint

```
GET /api/comments/item/:itemId/summary
```

Response:
```json
{
  "success": true,
  "data": {
    "summary": "AI-generated summary text...",
    "commentCount": 5
  }
}
```

