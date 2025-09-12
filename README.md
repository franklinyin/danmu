



## process to deploy to netlify

```
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist
```

#### if not linked

```
netlify link
```
#### check status

```
netlify status
```