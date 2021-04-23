# API for hexon

`POST /password`

- basic auth

```json
// body
{
  "password": "new_password"
}
```

`GET /search?query={regexp}&mode={string}`

- jwt auth

- `query` 为经过 encodeURIComponent 的正则
- `mode` 正则模式，默认为空，大小写敏感

```json
// return
[
  "cknukyhp80000vd3u1qf15kzv"
]
```