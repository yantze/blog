---
title: Vim
urlname: vfiz5q
date: '2021-01-23 12:50:42 +0800'
tags: []
categories: []
---

VIM 稳定、实用、设计理论化，在自身领域能力极强，强烈的对称观念。

对于极复杂的大型工程一般使用 IDE，不强求， something else。

最开始接触 VIM 的时候，听人说 VIM 很好，就用了一下 VIM，看 VIM 简陋不堪，所以就搁置了几个月，后来看到了[Ruchee](https://github.com/ruchee/vimrc)的 vim 配置文档，他的配置简单容易部署，所以后来在几分钟就建好了一个漂亮的 vim 编辑器的时候，高效编辑，高度灵活，我就喜欢上了这款编辑器。
下面是我 github 上[vim 项目](https://github.com/yantze/vimrc)的一部分说明

#### shortcut

```
Ctrl+P          快速查找当前文件夹下所有子目录的文件,ctrl+j/k上下选择文件
:ag             查找当前目录下的所有文件的关键字
,gd             使用YCM的快速查找头文件定义,类似vs中的F12
,ci             注释当前行(可选中)
,cm             块注释(可选中)
key<Tab>        UltiSnip And YCM 可以自动补全，UltiSnip对py，ycm对c好一些
                <c-j/k>上下选择下一个瞄准位
<c-n><c-j/k>    用<c-n>当前选中的行，用<c-j/k>来移动行的位置(vim-multipe-cursors)
<m-j/k>         用alt/command+j/k移动当前行的位置(功能同上)
<c-n>           不停的选中<c-n>,可以执行多光标编辑
                <c-p>回到前一个,<c-x>放弃当前这个光标到下一个
                其中i,a,I,A可以在insert模式，c,s可以在normal模式，c是清除当前选中的文字
                有个小bug,就是在多光标选中模式下，要先按i或者a这个键，再按I/A
,mt             生成每个语言的ctags文件，可以通过ctrl+]跳转和ctrl+t返回
+/-             +可以扩大选择区域/-相反
,bb /,bn<type char> 按等于号对其或者自定义符号对齐
:Sw             当需要root权限保存时，不用重新打开
:DiffSaved      比较在保存文件之后修改了什么那些内容
:Man glob       查看linux关于glob的man文档(only linux/mac)
:Man glob.php   查看从php.net中访问glob的相关语法和示例(only linux/mac)
K               判断文件类型，自动调用:Man function/command name
```

#### PHP 补全

可以使用 Ctrl+x,Ctrl+o 来补全内容

### vim 学习

如果是初学者，要学会这几个技巧
vim 有很多的‘模式’，在 normal 模式下
jkhl: 这四个键分别代表：下上左右
按字母 i，进入 insert 插入模式，然后就可以输入文字
按 ESC 键，退出 insert 进入 normal 模式
退出要先按英文冒号:然后输入 q

这些是基本的规则，如果要熟练的话，需要做一些高级的练习：

[简明 Vim 练级攻略](http://coolshell.cn/articles/5426.html)

[vim 游戏](http://vim-adventures.com/)

### 一些常用快捷键说明

```
/xxx                    查找xxx字符串
,ci                     注释选定行(自动识别文件类型后添加注释)
,n/,p                   切换buffer的标签(因为vim的一个窗口里面有多个buffer)
                        同时设置了新的快捷键F2/F3对应,n/,p
10G                     数字10和大写的G，跳到第十行

:s/^/#                  用"#"注释当前行 ,":s/<search>/<replace>"
:%s/x/b                 在所有行替换x为b,":%s/<search>/<replace>"
:2,50s/x/b              在2~50行替换x为b
:.,+3s/x/b              在前行和当前行后面的三行，替换x为b
:set notextmode         这个可以去掉^M这个符号
:set pastetoggle        可以解决在linux命令行复制内容的时候，
                        内容被识别为vim操作和乱序缩进,在我的配置中快捷键为F4

f<char>                 查找当前行的字符
gb                      go browser，光标下如果是url链接，自动用默认浏览器打开链接，
                        如果是选中的字符串，就用浏览器搜索, ,gb是另外一个插件提供的同样功能
gf                      如果光标下是一个文件路径，则可以用vim自动打开这个文件
gd                      找到光标下的标签定义
Ctrl+Tab/Ctrl+Shift+Tab 切换vim标签
Ctrl+w,v/h              在gvim下创建多窗口
Ctrl+h/j/k/l            在gvim下切换多窗口
]p                      和p的功能差不多，但是它会自动调整被粘贴的文本的缩进去适应当前代码的位置
K                       在Man里面查找光标当前所在处的词
Ctrl+X,Ctrl+O           自动补全,ycm占用Ctrl+n/p
zz                      把当前行移到屏幕中间
```

### 一些不常用但是实用的设置

```
:set display=uhex       这个是用来查看^@这种不可显示的字符，自动转换这些字符为hex进制
                        也可以ga查看当前光标的进制
,16                     转换当前文件为16进制，,r16为恢复，只有十六进制部分修改才有用
:vert command           垂直打开command中的命令,示例 :vert h manpageview
```

#### Tips

```
c/c++/objc/objc++   可以使用YCM
路径补全            可以使用YCM
光标定位            <c-o/i>上下选择前一次后一次光标位.
各个语言的补全      看~/.vim/snippets
ctags               可以自行在c/php等头文件建立ctags文件
                    c比如/usr/local/include, php比如pear的包管理中
```

#### Snip

一旦你输入下面的字符，按 Tab 键自动补全

```
#!
class
html5
```

#### leader 和 buffer

leader 默认是一个按钮，指的是反斜杠''，不过我在配置中设置成了',',减少小指的负担。

buffer 其实就是你当前下面的 buffer 而已。

当你了解到了基本的使用方法后，你可以读看看我在.vimrc 中的文档，里面有很多详细的技巧，熟悉后能和 sublime 和 notepad++一样顺手。

当然\_vimrc.bundles 这个文件里面是需要加载的插件，里面有介绍每个插件是拿来干嘛的，也可以了解一下。

我之前学习 vim 的时候，收集到的一些资料，这次重新复习了里面的内容，整理了一下发布了出来，就把它当成中级 vim 的入门手册吧

[下载地址](https://github.com/yantze/vimrc/blob/master/VIMdoc.md)。

### Thanks

这份 vim 配置的所以完成，会如此热爱 vim，是看到了 ruchee 的 vimrc 的配置,其完善的配置让我感觉 vim 是如此的简单

[ruchee](https://github.com/ruchee/vimrc)

我也参考了很多的 vim 配置:

[vimfiles](https://github.com/coderhwz/vimfiles)

[dotfiles](https://github.com/luin/dotfiles)

[vimrc](https://github.com/rhyzx/vimrc)

前段时间找到了 vim 的集成配置，功很强大

[The Ultimate Vim Distribution](http://vim.spf13.com/)

初学教程

[Learn Vimscript the Hard Way](http://learnvimscriptthehardway.stevelosh.com/)

[为什么 Vim 使用 HJKL 键作为方向键](http://www.cnbeta.com/articles/185694.htm)
