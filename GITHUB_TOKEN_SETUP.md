# GitHub Personal Access Token Setup

## Why Use a GitHub Token?

GitHub's API has rate limits:
- **Without authentication**: 60 requests per hour
- **With Personal Access Token**: 5,000 requests per hour

Using a token significantly improves the CommitFit experience by allowing more comprehensive analysis of GitHub profiles.

## How to Create a GitHub Personal Access Token

### Step 1: Go to GitHub Settings
1. Log in to GitHub
2. Click your profile picture in the top-right corner
3. Select **Settings**

### Step 2: Navigate to Developer Settings
1. Scroll down in the left sidebar
2. Click **Developer settings** (at the bottom)

### Step 3: Create Personal Access Token
1. Click **Personal access tokens**
2. Click **Tokens (classic)** or **Fine-grained tokens** (recommended)
3. Click **Generate new token**

### Step 4: Configure Token Permissions
For CommitFit, you need these permissions:
- ✅ **public_repo** (read public repositories)
- ✅ **read:user** (read user profile data)

### Step 5: Generate and Copy Token
1. Give your token a descriptive name (e.g., "CommitFit Analysis")
2. Set expiration (recommended: 90 days or 1 year)
3. Click **Generate token**
4. **IMPORTANT**: Copy the token immediately - you won't be able to see it again!

## How to Use in CommitFit

1. **Start the application** (backend on port 8001, frontend on port 3000)
2. **Open the frontend** in your browser
3. **Enter a GitHub username** in the first field
4. **Paste your token** in the "GitHub Personal Access Token" field
5. **Click "Analyze GitHub Profile"**

## Security Notes

- 🔒 **Never share your token** publicly
- 🔒 **Don't commit tokens** to version control
- 🔒 **Use environment variables** for production deployments
- 🔒 **Rotate tokens regularly** (every 90 days recommended)

## Troubleshooting

### "Invalid token" error
- Check that you copied the token correctly
- Ensure the token hasn't expired
- Verify the token has the correct permissions

### "Rate limit exceeded" with token
- Check if you've hit the 5,000/hour limit
- Wait for the rate limit to reset
- Consider using a different token if needed

### Token not working
- Make sure you're using the latest token (not an old one)
- Check that the token has `public_repo` and `read:user` permissions
- Try generating a new token if issues persist

## Alternative: Use Without Token

You can still use CommitFit without a token, but you'll be limited to 60 requests per hour. This is usually sufficient for testing with a few profiles.
