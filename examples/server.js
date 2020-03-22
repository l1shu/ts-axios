const express = require('express');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const WebpackConfig = require('./webpack.config');
const router = express.Router();

const app = express();
const compiler = webpack(WebpackConfig);

app.use(webpackDevMiddleware(compiler, {
  publicPath: WebpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
}));

app.use(webpackHotMiddleware(compiler));

app.use(express.static(__dirname));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.get('/simple/get', function(req, res) {
  res.json({
    msg: `hello world`
  })
});
router.get('/base/get', function(req, res) {
  res.json(req.query)
})
router.post('/base/post', function(req, res) {
  res.json(req.body)
})
router.post('/base/buffer', function(req, res) {
  let msg = [];
  req.on('data', (chunk) => {
    if (chunk) {
      console.log(chunk);
      msg.push(chunk) // 不能采用字符串的拼接方式，会有乱码问题
    }
  })
  req.on('end', () => {
    let buf = Buffer.concat(msg)
    res.json(buf.toJSON())
  })
})

app.use(router)

const port = process.env.PORT || 8080;
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
});