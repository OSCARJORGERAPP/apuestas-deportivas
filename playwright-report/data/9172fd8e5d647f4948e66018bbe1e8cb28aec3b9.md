# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Autenticación con Magic Link >> debe enviar magic link y permitir login
- Location: tests\e2e\auth.spec.js:4:3

# Error details

```
Error: page.evaluate: TypeError: Failed to fetch
    at eval (eval at evaluate (:303:30), <anonymous>:1:7)
    at UtilityScript.evaluate (<anonymous>:305:16)
    at UtilityScript.<anonymous> (<anonymous>:1:44)
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e4]:
        - link "🎯 Apuestas" [ref=e5] [cursor=pointer]:
          - /url: /
        - link "Participar" [ref=e7] [cursor=pointer]:
          - /url: /login
    - generic [ref=e9]:
      - generic [ref=e10]:
        - link "⚽ Apuestas" [ref=e11] [cursor=pointer]:
          - /url: /
        - heading "Bienvenido" [level=1] [ref=e12]
        - paragraph [ref=e13]: Accede con tu email
      - generic [ref=e14]:
        - generic [ref=e15]:
          - generic [ref=e16]: Email
          - textbox "tu@email.com" [ref=e17]
        - generic [ref=e18]: ✅ Magic link enviado a tu email. Revisa tu bandeja de entrada.
        - button "Enviar magic link" [ref=e19]
      - paragraph [ref=e20]:
        - text: "Testing:"
        - link "ver emails" [ref=e21] [cursor=pointer]:
          - /url: http://localhost:8025
  - button "Open Next.js Dev Tools" [ref=e27] [cursor=pointer]:
    - img [ref=e28]
  - alert [ref=e31]
```