#!/bin/bash

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BRANCH_NAME=$(git branch --show-current)
PROJECT_NAME="phishwise"
MAX_RETRIES=3
RETRY_COUNT=0

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}PhishWise Auto-Deploy Pipeline${NC}"
echo -e "${GREEN}========================================${NC}\n"

# Function: Git commit and push
function git_commit_push() {
    echo -e "${YELLOW}📝 Committing changes...${NC}"
    
    # Add all changes
    git add .
    
    # Generate commit message with timestamp
    COMMIT_MSG="Auto-deploy: $(date '+%Y-%m-%d %H:%M:%S') - Claude Code automated commit"
    
    # Check if there are changes to commit
    if git diff-index --quiet HEAD --; then
        echo -e "${YELLOW}No changes to commit${NC}"
        return 0
    fi
    
    git commit -m "$COMMIT_MSG"
    
    echo -e "${YELLOW}🚀 Pushing to GitHub...${NC}"
    git push origin "$BRANCH_NAME"
    
    echo -e "${GREEN}✓ Changes pushed to $BRANCH_NAME${NC}\n"
}

# Function: Wait for Vercel deployment
function wait_for_deployment() {
    echo -e "${YELLOW}⏳ Waiting for Vercel deployment...${NC}"
    
    # Get latest deployment URL
    DEPLOY_URL=$(vercel ls --token "$VERCEL_TOKEN" | grep "$BRANCH_NAME" | head -n 1 | awk '{print $2}')
    
    if [ -z "$DEPLOY_URL" ]; then
        echo -e "${RED}❌ Could not find deployment URL${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}Deployment URL: $DEPLOY_URL${NC}"
    
    # Poll deployment status (max 5 minutes)
    for i in {1..60}; do
        STATUS=$(curl -s "https://api.vercel.com/v6/deployments?teamId=$VERCEL_TEAM_ID" \
            -H "Authorization: Bearer $VERCEL_TOKEN" | \
            jq -r ".deployments[0].state")
        
        if [ "$STATUS" = "READY" ]; then
            echo -e "${GREEN}✓ Deployment successful!${NC}\n"
            return 0
        elif [ "$STATUS" = "ERROR" ]; then
            echo -e "${RED}❌ Deployment failed${NC}\n"
            return 1
        fi
        
        echo -n "."
        sleep 5
    done
    
    echo -e "${RED}❌ Deployment timeout${NC}"
    return 1
}

# Function: Fetch and parse deployment logs
function get_deployment_logs() {
    echo -e "${YELLOW}📋 Fetching deployment logs...${NC}"
    
    # Get latest deployment ID
    DEPLOYMENT_ID=$(vercel ls --token "$VERCEL_TOKEN" | grep "$BRANCH_NAME" | head -n 1 | awk '{print $1}')
    
    # Fetch logs
    vercel logs "$DEPLOYMENT_ID" --token "$VERCEL_TOKEN" > /tmp/vercel_deploy.log
    
    # Display logs
    cat /tmp/vercel_deploy.log
}

# Function: Parse errors from logs
function parse_errors() {
    echo -e "\n${YELLOW}🔍 Analyzing errors...${NC}"
    
    # Extract error patterns
    ERRORS=$(grep -E "ERROR|Error|error|Failed|failed|FATAL" /tmp/vercel_deploy.log || true)
    
    if [ -z "$ERRORS" ]; then
        echo -e "${GREEN}✓ No errors detected${NC}"
        return 0
    fi
    
    echo -e "${RED}Errors found:${NC}"
    echo "$ERRORS"
    
    # Save errors to file for Claude Code to read
    echo "$ERRORS" > /tmp/deployment_errors.txt
    
    return 1
}

# Function: Trigger Claude Code to fix errors
function trigger_claude_fix() {
    echo -e "${YELLOW}🤖 Triggering Claude Code auto-fix...${NC}"
    
    # This is where Claude Code reads the error file and makes fixes
    # The actual fix logic is in the Claude Code prompt below
    
    echo -e "${YELLOW}Claude Code should now read /tmp/deployment_errors.txt and apply fixes${NC}"
    echo -e "${YELLOW}Errors saved to: /tmp/deployment_errors.txt${NC}"
    
    # Signal that manual intervention is needed
    return 1
}

# Main execution flow
function main() {
    echo -e "${YELLOW}Starting deployment pipeline...${NC}\n"
    
    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
        echo -e "${YELLOW}Attempt $(($RETRY_COUNT + 1))/$MAX_RETRIES${NC}\n"
        
        # Step 1: Commit and push
        git_commit_push
        
        # Step 2: Wait for deployment
        if wait_for_deployment; then
            echo -e "${GREEN}========================================${NC}"
            echo -e "${GREEN}🎉 Deployment successful!${NC}"
            echo -e "${GREEN}========================================${NC}"
            exit 0
        fi
        
        # Step 3: Get logs
        get_deployment_logs
        
        # Step 4: Parse errors
        if ! parse_errors; then
            # Step 5: Trigger Claude Code fix
            trigger_claude_fix
            
            RETRY_COUNT=$((RETRY_COUNT + 1))
            
            if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
                echo -e "${YELLOW}Waiting 30 seconds before retry...${NC}"
                sleep 30
            fi
        fi
    done
    
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}❌ Deployment failed after $MAX_RETRIES attempts${NC}"
    echo -e "${RED}========================================${NC}"
    exit 1
}

main