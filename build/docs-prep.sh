#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default branch suffix
BRANCH_SUFFIX="release"

# Check if a custom version parameter was provided
if [ $# -eq 1 ]; then
  BRANCH_SUFFIX="$1"
fi

# Branch name to create
NEW_BRANCH="gh-pages-${BRANCH_SUFFIX}"

# Function to print colored messages
print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
  exit 1
}

print_info() {
  echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

# Function to execute command with error handling
execute() {
  print_info "Running: $1"
  eval $1
  if [ $? -ne 0 ]; then
    print_error "Failed to execute: $1"
  else
    print_success "Successfully executed: $1"
  fi
}

# Check if /tmp/_site directory exists from a previous run
if [ -d "/tmp/_site" ]; then
  print_warning "Found existing /tmp/_site directory. Removing it…"
  rm -rf /tmp/_site
fi

# Main process
print_info "Starting documentation deployment process…"

# Step 1: Build documentation
print_info "Building documentation with npm run docs…"
npm run docs
if [ $? -ne 0 ]; then
  print_error "Documentation build failed!"
fi
print_success "Documentation built successfully"

# Step 2: Move _site to /tmp/
print_info "Moving _site to temporary location…"
execute "mv _site /tmp/"

# Step 3: Switch to gh-pages branch
print_info "Checking out gh-pages branch…"
git checkout gh-pages
if [ $? -ne 0 ]; then
  print_error "Failed to checkout gh-pages branch. Make sure it exists."
fi
print_success "Switched to gh-pages branch"

git reset --hard origin/gh-pages
if [ $? -ne 0 ]; then
  print_error "Failed to reset to origin/gh-pages. Check your git configuration."
fi
print_success "Reset to origin/gh-pages"

git pull origin gh-pages
if [ $? -ne 0 ]; then
  print_error "Failed to pull from origin/gh-pages. Check your network connection and git configuration."
fi
print_success "Pulled latest changes from origin/gh-pages"

# Step 4: Create a new branch for the update
print_info "Creating new branch ${NEW_BRANCH}…"
execute "git checkout -b ${NEW_BRANCH}"

# Step 5: Move root files
print_info "Moving root files from temporary location…"
ROOT_FILES=("404.html" "CNAME" "apple-touch-icon.png" "favicon.ico" "index.html" "robots.txt" "sitemap-0.xml" "sitemap-index.xml" "sw.js")
for file in "${ROOT_FILES[@]}"; do
  if [ -f "/tmp/_site/$file" ]; then
    execute "mv /tmp/_site/$file ."
  else
    print_warning "File /tmp/_site/$file not found. Skipping."
  fi
done

# Step 6: Move directories with cleanup
print_info "Moving directories from temporary location…"
DIRS=("about" "components" "docsref" "examples" "getting-started" "migration")
for dir in "${DIRS[@]}"; do
  if [ -d "/tmp/_site/$dir" ]; then
    if [ -d "$dir" ]; then
      execute "rm -rf $dir"
    fi
    execute "mv /tmp/_site/$dir ."
  else
    print_warning "Directory /tmp/_site/$dir not found. Skipping."
  fi
done

# Step 7: Handle special doc directories
print_info "Handling special documentation directories…"
SPECIAL_DOCS=("docs/getting-started" "docs/versions")
for dir in "${SPECIAL_DOCS[@]}"; do
  if [ -d "/tmp/_site/$dir" ]; then
    if [ -d "$dir" ]; then
      execute "rm -rf $dir"
    fi
    # Make sure parent directory exists
    parent_dir=$(dirname "$dir")
    mkdir -p "$parent_dir"
    execute "mv /tmp/_site/$dir $parent_dir/"
  else
    print_warning "Directory /tmp/_site/$dir not found. Skipping."
  fi
done

# Step 8: Move docs index.html
if [ -f "/tmp/_site/docs/index.html" ]; then
  execute "mv /tmp/_site/docs/index.html docs/index.html"
else
  print_warning "File /tmp/_site/docs/index.html not found. Skipping."
fi

# Step 9: Handle docs/5.3
if [ -d "/tmp/_site/docs/5.3" ]; then
  if [ -d "docs/5.3" ]; then
    execute "rm -rf docs/5.3"
  fi
  execute "mv /tmp/_site/docs/5.3 docs/"
else
  print_warning "Directory /tmp/_site/docs/5.3 not found. Skipping."
fi

# Clean up remaining files in /tmp/_site if any
if [ -d "/tmp/_site" ]; then
  remaining_files=$(find /tmp/_site -type f | wc -l)
  remaining_dirs=$(find /tmp/_site -type d | wc -l)
  if [ $remaining_files -gt 0 ] || [ $remaining_dirs -gt 1 ]; then
    print_warning "There are still some files or directories in /tmp/_site that weren't moved."
    print_warning "You may want to inspect /tmp/_site to see if anything important was missed."
  else
    print_info "Cleaning up temporary directory…"
    rm -rf /tmp/_site
    print_success "Temporary directory cleaned up"
  fi
fi

# Step 10: Remove empty site directory if it exists
if [ -d "site" ]; then
  print_info "Removing empty site directory…"
  execute "rm -rf site"
fi

print_success "Docs prep complete!"
print_info "Review changes before committing and pushing."
print_info "Next steps:"
print_info "  1. Run a local server to review changes"
print_info "  2. Check browser and web inspector for any errors"
print_info "  3. git add ."
print_info "  4. git commit -m \"Update documentation\""
print_info "  5. git push origin ${NEW_BRANCH}"
