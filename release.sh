#!/usr/bin/env sh

# 告诉脚本如果执行结果不为 true 则退出。
set -e

# 在控制台输出 Enter release version:
echo "Enter release version: "

# 表示从标准输入读取值，并赋值给 $VERSION 变量
read VERSION

# read -p 表示给出提示符
# -n 1 表示限定最多可以有 1 个字符可以作为有效读入
# -r 表示禁止反斜线的转义功能。因为我们的 read 并没有指定变量名，那么默认这个输入读取值会赋值给 $REPLY 变量
read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r

# 输出空值表示跳到一个新行
echo

# 判断 $REPLY 是不是大小写的 y
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."

  # commit
  git add -A
  git commit -m "[build] $VERSION"
  npm version $VERSION --message "[release] $VERSION"
  git push origin master

  # publish, 我们会把 dist 目录下的代码都发布到 npm 上，因为我们在 package.json 中配置的是 files 是 ["dist"]
  npm publish
fi