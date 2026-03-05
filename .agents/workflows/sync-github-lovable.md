---
description: Automated GitHub and Lovable synchronization workflow for agents
---

// turbo-all

After completing any task that involves modifying the codebase, follow these steps to ensure changes are synced with GitHub and Lovable:

1. Stage all changes:
```powershell
& "C:\Program Files\Git\bin\git.exe" add .
```

2. Commit changes with a descriptive message:
```powershell
& "C:\Program Files\Git\bin\git.exe" commit -m "Auto-sync: <brief description of changes>"
```

3. Integrate remote changes from Lovable (to avoid conflicts):
```powershell
& "C:\Program Files\Git\bin\git.exe" pull --rebase origin main
```

4. Push to GitHub:
```powershell
& "C:\Program Files\Git\bin\git.exe" push origin main
```

> [!IMPORTANT]
> Always run these steps from the project root directory. If a merge conflict occurs during `pull --rebase`, resolve it manually or ask the user for guidance.
