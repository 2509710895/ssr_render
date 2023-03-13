import React from "react"
import express from "express";
import App  from "./App";
import {renderToString} from "react-dom/server"

/*
    引入客户端 React 根组件，调用 renderToString 将其渲染为 HTML 字符串；
    获取客户端打包产物映射文件 manifest 文件，然后将组件 HTML 字符串与 entry-client.js 产物路径注入到 HTML 中，并返回给客户端。
*/

// 通过 mainfest 文件，找到正确的产物路径
const clientManifest=require("../dist/manifest-client.json")

const server=express()

server.get("/",(req,res)=>{
    const html=renderToString(<App/>)
    const clientCss=clientManifest["client.css"]
    const clientBundle=clientManifest["client.js"]

    res.send(`<!DOCTYPE html>
    <html>
        <head>
          <title>React SSR Example</title>
          <link rel="stylesheet" href="${clientCss}"></link>
        </head>
        <body>
          <!-- 注入组件运行结果 -->
          <div id="app">${html}</div>
          <!-- 注入客户端代码产物路径 -->
          <!-- 实现 Hydrate 效果 -->
          <script src="${clientBundle}"></script>
        </body>
    </html>
        `)
})

server.use(express.static("./dist"))

server.listen(3000,()=>{
    console.log("开启3000端口");
})