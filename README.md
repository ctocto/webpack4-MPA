# webpack4-MPA

基于 webpack4 实现的多入口项目脚手架。

mini-css-extract-plugin 提取 CSS 文件，
html-webpack-plugin 实现 html 多入口，
less-loader 实现 less 编译，
postcss-loader 配置 autoprefixer 实现自动添加浏览器兼容前缀，
html-withimg-loader 实现 html 内引入图片版本号添加和模板功能，
babel-loader 实现 ES6+ 转码功能。

## 使用

### 安装

```
npm install
```

### 开发

```
npm start
```

### 预览

```
http://localhost:8088/webpack-dev-server
```

### 构建

```
npm run build
```

### 目录

```
├── dist                         # 构建后的目录
├── config                       # 项目配置文件
│   ├── webpack.common.js        # webpack 公共配置
|   ├── webpack.dev.js           # webpack 开发配置
|   ├── webpack.prod.js          # webpack 生产配置
|   ├── webpack.dll.js           # webpack dll
│   └── postcss.config.js        # postcss 配置文件
├── src                          # 程序源文件
│   └── lib                      # JS 库等，不参与路由匹配      
│   │    └── jquery.js 
│   │
│   ├── dll
│   │    └── dll.*.*.js          # dll 文件（第三方库）
│   │
│   └── pages                
│   │    │
│   │    └── one
|   │    │    ├── images         # 图片资源
|   │    │    ├── js             # javascript 资源
|   │    │    │    ├── index.js  # 匹配 view/one/index.html 的 js（入口js）
|   │    │    │    └── list.js   # 匹配 view/one/list.html 的 js（入口js）
|   │    │    ├── style          # 样式 资源
|   │    │    │    ├── index.css
|   │    │    │    └── list.less
│   │    │    ├── index.html     # 匹配 view/one/index.html
│   │    │    └── list.html      # 匹配 view/one/index.html
|   │    └── two
|   │         ├── images         # 图片资源
|   │         ├── js             # javascript 资源
|   │         │    ├── index.js  # 匹配 view/two/index.html 的 js（入口js）
|   │         │    └── list.js   # 匹配 view/two/list.html 的 js（入口js）
|   │         ├── style          # 样式 资源
|   │         │    ├── index.css
|   │         │    └── list.less
│   │         ├── index.html     # 匹配 view/two/index.html
│   │         └── list.html      # 匹配 view/two/list.html
│   └── template                 # html 模板目录
│       └── head.html         
│       └── foot.html    
│
├── .babelre
│
├── .webpackrc.json              # webpack 用户配置文件
│    
```

> 待完善
