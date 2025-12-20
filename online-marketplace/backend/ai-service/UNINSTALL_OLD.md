# Uninstall Old PyTorch Dependencies

Before installing the new ONNX Runtime dependencies, uninstall the old PyTorch packages:

```bash
cd online-marketplace/backend/ai-service
pip uninstall torch torchvision torchaudio -y
```

This will free up significant disk space (~1-2 GB).

