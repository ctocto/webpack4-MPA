# webpack2-demo

基于 webpack2 实现的多入口项目脚手架。

使用 extract-text-webpack-plugin 实现 js 、css 公共代码提取，
html-webpack-plugin 实现 html 多入口，
less-loader 实现 less 编译，
postcss-loader 配置 autoprefixer 实现自动添加浏览器兼容前缀，
html-withimg-loader 实现 html 内引入图片版本号添加和模板功能，
babel-loader 实现 ES6 转码功能。

## 使用

### 安装

```
npm install
```

### 开发

```
npm run dev
```

### 构建

```
npm run build
```

### 目录

```
├── build                        # 构建后的目录
├── config                       # 项目配置文件
│   ├── webpack.config.js        # webpack 配置引导文件
|   ├── webpack.dev.config.js    # webpack 开发配置
|   ├── webpack.prod.config.js   # webpack 生产配置
│   └── postcss.config.js        # postcss 配置文件
├── src                          # 程序源文件
│   └── lib                      # JS 库等，不参与路由匹配      
│   ├    └── jquery.js 
│   └── pages                
│   ├    └── index.html          # 匹配 view/index.html
│   ├    └── one         
│   ├    ├    ├── index.html     # 匹配 view/one/index.html
│   ├    ├    └── list.html      # 匹配 view/one/index.html
|   |    └── two
│   ├    ├    ├── index.html     # 匹配 view/two/index.html
│   ├    ├    └── list.html      # 匹配 view/two/list.html
│   └── template                 # html 模板目录
│       └── head.html         
│       └── foot.html            
```

> 待完善
