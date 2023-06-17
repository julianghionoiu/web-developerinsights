# web-developerinsights

To develop locally and reload on changes
```
gulp
```

The above will also update the dist folder

To release to main website
```
aws s3 sync . s3://developerinsights.co
```

