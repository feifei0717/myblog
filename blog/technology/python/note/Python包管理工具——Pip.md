 

[TOC]



# Python包管理工具——Pip



## 1 前言

应该尽量使用pip，不要继续使用easy_install.

`pip` 是一个[Python](http://lib.csdn.net/base/python)包管理工具，主要是用于安装 `PyPI` 上的软件包，可以替代 `easy_install` 工具。

- GitHub: <https://github.com/pypa/pip>
- Doc: <https://pip.pypa.io/en/latest/>

## 2 获取pip

### 2.1 脚本安装pip

```
$ curl -O https://bootstrap.pypa.io/get-pip.py
$ python get-pip.py
```

### 2.2 使用包管理软件安装

```
$ sudo yum install python-pip
$ sudo apt-get install python-pip
```

### 2.3 更新pip

```
$ pip install -U pip
```

## 3 pip基本使用

### 3.1 安装PyPI软件

```
$ pip install SomePackage

  [...]
  Successfully installed SomePackage
```

### 3.2 查看具体安装文件

```
$ pip show --files SomePackage

  Name: SomePackage
  Version: 1.0
  Location: /my/env/lib/pythonx.x/site-packages
  Files:
   ../somepackage/__init__.py
   [...]
```

### 3.3 查看哪些软件需要更新

```
$ pip list --outdated

  SomePackage (Current: 1.0 Latest: 2.0)
```

### 3.4 升级软件包

> ```
> $ pip install --upgrade SomePackage
>
>   [...]
>   Found existing installation: SomePackage 1.0
>   Uninstalling SomePackage:
>     Successfully uninstalled SomePackage
>   Running setup.py install for SomePackage
>   Successfully installed SomePackage
>
> ```

### 3.5 卸载软件包

> ```
> $ pip uninstall SomePackage
>
>   Uninstalling SomePackage:
>     /my/env/lib/pythonx.x/site-packages/somepackage
>   Proceed (y/n)? y
>   Successfully uninstalled SomePackage
>
> ```

## 4 pip简明手册

### 4.1 安装具体版本软件

> ```
> $ pip install SomePackage            # latest version
> $ pip install SomePackage==1.0.4     # specific version
> $ pip install 'SomePackage>=1.0.4'     # minimum version
>
> ```

### 4.2 Requirements文件安装依赖软件

`Requirements文件` 一般记录的是依赖软件列表，通过pip可以一次性安装依赖软件包:

> ```
> $ pip freeze > requirements.txt
>
> $ pip install -r requirements.txt
>
> ```

### 4.3 列出软件包清单

> ```
> $ pip list
>
> $ pip list --outdated
>
> ipython (Current: 1.2.0 Latest: 2.3.0)
>
> ```

### 4.4 查看软件包信息

> ```
> $ pip show pip
> ---
> Name: pip
> Version: 1.4.1
> Location: /Library/Python/2.7/site-packages/pip-1.4.1-py2.7.egg
> Requires:
>
> $ pip show pyopencl
> ---
> Name: pyopencl
> Version: 2014.1
> Location: /Library/Python/2.7/site-packages
> Requires: pytools, pytest, decorator
>
> ```

### 4.5 搜寻

> ```
> $ pip search pycuda
>
> pycuda                    - Python wrapper for Nvidia CUDA
> pyfft                     - FFT library for PyCuda and PyOpenCL
> cudatree                  - Random Forests for the GPU using PyCUDA
> reikna                    - GPGPU algorithms for PyCUDA and PyOpenCL
> compyte                   - A common set of compute primitives for PyCUDA and PyOpenCL (to be created)
>
> ```

### 4.6 配置文件

配置文件: `$HOME/.pip/pip.conf`, 举例:

> ```
> [global]
> timeout = 60
> index-url = http://download.zope.org/ppix
>
> [install]
> ignore-installed = true
> no-dependencies = yes
>
> ```

### 4.7 命令行自动补全

对于bash:

> ```
> $ pip completion --bash >> ~/.profile
>
> ```

对于zsh:

> ```
> $ pip completion --zsh >> ~/.zprofile
>
> ```

加载此配置文件后，则pip命令支持自动补全功能.





http://blog.csdn.net/weiwangchao_/article/details/72466406