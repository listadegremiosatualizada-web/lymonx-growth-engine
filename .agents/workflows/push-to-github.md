---
description: Push all local changes to GitHub (and sync Lovable) after every edit
---

// turbo-all

After making ANY code change to the project, always run the following steps automatically:

1. Stage all changed files:
```powershell
& "C:\Program Files\Git\bin\git.exe" add .
```

2. Commit with a descriptive message summarizing the changes made:
```powershell
& "C:\Program Files\Git\bin\git.exe" commit -m "<describe the changes made>"
```

3. Push to GitHub:
```powershell
& "C:\Program Files\Git\bin\git.exe" push
```

All commands must be run from the project directory: `C:\Users\silvi\OneDrive\Desktop\lymonx-growth-engine-main`
