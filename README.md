## devtools

* source-map 保存信息包括 行和列
* cheap-module-source-map 独立行，不包括列
* eval-source-map 开发阶段，上线前一定要 devtool 删除
* cheap-module-eval-source-map 列 简单的项目

## window 和 mac 设置开发模式

* window： "build": "set type=build&webpack"
* mac "build": "export type=build&&webpack"
