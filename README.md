# 农名工实名制管理系统Vue开发指南


## 目录

* [快速启动](#fast)
* [架构](#frame)
* [代码规范](#standard)
* [项目主依赖](#depend)
* [公共组件](#component)
* [icon的使用](#icon)
* [投入生产](#prod)

## <span id="fast">快速启动</span>

1. svn管理

    svn地址：`svn://192.168.1.107/CRCIWMS/branch/20190417first/web`

2. 环境准备

    1. 在`环境准备`文件夹中下载并安装node-v8.9.0-x64.msi。进入cmd，执行：

            npm -v

        检查node是否安装成功。

    2. 为保证代码的格式风格一致性，建议使用visual studio code开发。在`环境准备`文件夹有`VSCodeSetup-x64-1.23.0.exe`安装包。

3. 项目启动

    1. cmd进入`web`根目录，下载依赖npm包：

            npm install


    2. 安装vue：

            npm install vue -g

    3. 配置项目：

        1. 配置项目代理：

            修改`vue.config.js`：

            ```
            proxy: {
                '/': {
                    target: 'http://192.168.0.111:8800', //本地调试目标地址
                    changeOrigin: true, //是否允许跨域
                    ws: true,// 是否启用websockets
                    pathRewrite: {
                    '^/': '/' //目标路径代理
                    }
                }
            }

    4. 在根目录下，运行项目：

            npm run serve

    5. 无法运行

        某些情况下,`node-sass`的依赖包可能在`npm i`的时候没有安装成功,如出现`node-sass`依赖包的错误,可以使用`npm i node-sass`的命令,安装完之后再`npm run dev`进入项目;

## <span id="frame">架构</span>
* `build` webpack的配置目录
  * `build.js` 生产环境构建代码
  * `check-version.js` 检查node、npm等版本
  * `webpack.base.conf.js` webpack基础配置
  * `webpack.dev.conf.js` webpack开发环境配置
  * `webpack.prod.conf.js` webpack生产环境配置
  * `utils.js` 构建工具相关
* `config` 项目开发环境配置
  * `dev.env.js` 开发环境变量
  * `index.js` 项目配置变量
  * `prod.env.js ` 生产环境变量
  * `test.env.js` 测试环境变量
* `dist` 项目打包目录
* `node_modules` 项目依赖包目录
* `src` 开发目录
  * `main.js` 入口
  * `App.vue` 根组件
  * `assets` 静态资源
  * `components` 组件
  * `views` 页面
  * `api` 请求相关
  * `router` 路由文件夹
* `index.html` 入口页面
* `.babelrc` ES6语法编译配置
* `.editorconfig` 定义代码格式
* `package.json` 包管理配置文件

## <span id="standard">代码规范</span>

为保证目录的可读及快速查找，有如下规范请务必遵守：

1. 组件代码统一存放在`src/components`文件夹下：

2. 页面代码统一存放在`src/views`文件夹下：

3. 请求相关代码统一存放在`src/api`文件夹下：

  ```
    // 定义
    export const login = ({ userName, password }) => {
      const data = {
        userName,
        password
      }
      return axios.request({
        url: 'login',
        data,
        method: 'post'
      })
    }

  ```

4. 代码规范：

    每个vue组件内,应包含`HTML`、`CSS`、`JS`,顺序建议为`CSS>HTML>JS`,除公共CSS外,style文件应该`scope`,例如\<style lang='scss' scope>

    除特殊情况外，`CSS`文件应单独存放于`.css`文件内，再引入使用，例如：
    ```
      <style scoped lang="scss">
          @import "./login.scss";
      </style>
    ```

5. 其他事项：
    1. 一些常用的工具类,放在了`src/assets/js/utils.js`中;
    2. 项目中用到的一些JSON文件,放在了`src/assets/js/commonJSON.js`中;
    3. 项目中使用了Sass作为CSS的预处理语言,建议统一使用Sass,或者使用普通的级联选择,如你习惯使用LESS,那在语法上应该和Sass类似,建议你可以尝试下使用Sass
    4. 除了`scope`的CSS外,在`assets`文件夹内,还有一个`common.css`文件,该文件内,建议放置我们常用的css即可,其他css尽量放在组件内,便于维护
    5. 如果需要修改`common.css`中的内容,请写好注释(功能、作者、描述、日期等),例如：
        ```
        /*
        * 功能：全局滚动条的样式
        * 作者：曾文聪
        * 描述：重新定义默认的滚动条的样式，变的更加的扁平化
        * 创建日期：2018-08-10
        */
        ```

## <span id="depend">项目主依赖</span>
项目主依赖项。


1. `vue@2.6.10`

    项目基于vue2.x版本进行开发;

2. `axios@0.18.0`

    http服务使用axios

3. `vue-router@3.0.3`

    路由使用vue-router@3.0.3;

4. `iview@3.x.x`

    UI使用iview3.x版本,该版本目前是较新版本,大部分内容对2.x内容兼容;
    详细文档参照[iview官方文档](https://www.iviewui.com/)


## <span id="component">公共组件</span>
  项目中已经封装好了table和tree的相应组件,位置在`src/components/common`文件夹内;其中:

1. `Tree`

    `Tree`是全局使用的组织架构树组件。

2. `Table`

    Table是全局使用的列表组件,简单用法在同级目录中的`TableDemo.vue`中有罗列。


## <span id="icon">icon的使用</span>
    项目中已经封装好了iconfont和svg的使用方法,对于页面上的小图标,建议使用iconfont,如不能满足,再考虑使用svg;

1. iconfont的使用：

    在`common.css`中已经写入了iconfont的style,项目中直接使用即可,例如：
    ```
    1、因iview中提供了Icon的使用,如果是自定义icon,需要加上`custom`关键字;例如:
    <Icon custom="i-icon icon-i-monitor" size="16" />

    2、在非`render`模式下,用法应该为
    <i class="i-icon i-icon icon-i-eye" />

2. svg的使用：

    为方便使用,已将svg的使用封装成组件,将要使用的svg内容放到`src/assets/img/icons/svg`文件夹中,使用参考：
    ```
    <svg-icon icon-class="time"></svg-icon>

## <span id="prod">投入生产</span>


1. 项目打包

    1. 打包

        执行命令：

            npm run build
    2. 文件位置

        打包好的文件会存放在`dist`文件夹内,其中index.html是入口html文件,`static`文件夹是所有的静态资源文件(css、js等)

2. 打包失败

    1. node-sass
        依赖文件`node-sass`的安装条件比较苛刻，有可能在`npm install`的时候并没有安装成功，可以单独再安装一次；
        执行命令`npm install node-sass`之后再执行`npm run build`

3. 项目代理

    1. 本地环境
        Vue在本地环境运行的时候,自身会基于`express`搭建环境,并通过config中的相应配置实现跨域代理等操作;

    1. 生产环境
        本项目在生产环境中,前端的静态资源代理服务使用了ngnix解决;




