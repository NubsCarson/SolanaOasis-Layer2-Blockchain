#!/bin/bash
set -e

# Check if virtual environment exists, create if it doesn't
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# Create test directories
TEST_DIR=$(mktemp -d)
MODEL_DIR="$TEST_DIR/models"
mkdir -p "$MODEL_DIR"

echo "Creating test model..."
python tests/test_model.py "$MODEL_DIR"

echo "Building project..."
export RUST_BACKTRACE=1
export ROCKSDB_LIB_DIR=/usr/lib/x86_64-linux-gnu
export ROCKSDB_STATIC=1
export RUSTFLAGS="-C target-cpu=native"
cargo build

echo "Running tests..."
RUST_LOG=info cargo test -- --nocapture

echo "Cleaning up..."
rm -rf "$TEST_DIR"
deactivate

echo "Tests completed!" 