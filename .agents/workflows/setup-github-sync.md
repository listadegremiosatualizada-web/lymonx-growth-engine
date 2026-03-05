---
description: Setup inicial de Git + GitHub + Lovable para qualquer projeto novo
---

// turbo-all

Use este workflow sempre que abrir um projeto novo para editar. Ele garante que as alterações locais sejam refletidas no GitHub e no Lovable.

## Passo 1 – Inicializar o Git (se ainda não existir)

Verifique se já existe um repositório git no projeto:
```powershell
& "C:\Program Files\Git\bin\git.exe" status
```

Se retornar erro ("not a git repository"), inicialize:
```powershell
& "C:\Program Files\Git\bin\git.exe" init
```

## Passo 2 – Conectar ao repositório remoto do GitHub

Pergunte ao usuário qual é a URL do repositório GitHub do projeto (ex: https://github.com/usuario/nome-do-repo.git) e adicione como remote:
```powershell
& "C:\Program Files\Git\bin\git.exe" remote add origin <URL_DO_REPOSITORIO>
```

Se já existir um remote, pule este passo.

## Passo 3 – Verificar qual branch o Lovable usa

Liste os branches remotos para identificar o branch principal (normalmente `main`):
```powershell
& "C:\Program Files\Git\bin\git.exe" branch -r
```

## Passo 4 – Sincronizar com o branch correto

Faça pull do branch principal do Lovable antes de qualquer edição:
```powershell
& "C:\Program Files\Git\bin\git.exe" fetch origin
& "C:\Program Files\Git\bin\git.exe" checkout main
& "C:\Program Files\Git\bin\git.exe" pull origin main
```

Se o branch for `master`, substitua `main` por `master`.

## Passo 5 – Após cada edição, enviar para GitHub/Lovable

Após toda alteração, rode automaticamente:
```powershell
& "C:\Program Files\Git\bin\git.exe" add .
& "C:\Program Files\Git\bin\git.exe" commit -m "<descrição das mudanças feitas>"
& "C:\Program Files\Git\bin\git.exe" push origin main
```

> O Lovable atualiza automaticamente ao receber o push no branch correto.
