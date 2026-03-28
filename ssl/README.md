# TLS voor lokale HTTPS-proxy

De bestanden `localhost+2.pem` en `localhost+2-key.pem` worden hier geplaatst door **mkcert** (staan in `.gitignore`).

Vanuit de root van deze repo:

```bash
cd ssl && mkcert localhost 127.0.0.1 ::1
```

Daarna (aanbevolen, één keer op je Mac):

```bash
mkcert -install
```

Zonder `-install` vertrouwt Cursor/browser het certificaat mogelijk niet.
