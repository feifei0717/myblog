因为从10.5版本开始适用Mac OS，SVN一直都是默认安装的软件。 

后来发现一个简单的办法。 

如果你有安装XCode，只需要在code > Preferences > download > Command Line Tools > Install即可，速度很快，基本1分钟搞定。 这个Command Line Tools包含最新的SVN。然后如果你没有安装XCode的话，就会很痛苦，采用这种办法就会很痛苦，因为XCode接近于1.5GB了！尤其是对于那些只是需要SVN，而不会用到XCode的朋友来讲。 

幸运的是，可以做到在没有安装XCode 的前提下安装SVN，只需要在Apple Developer网站下载一个116MB的[https://developer.apple.com/downloads/index.action](https://developer.apple.com/downloads/index.action) Command Line Tools(OS X Mountain Lion)独立安装包。当然你需要一个Apple Developer的ID（可以免费注册的）。 

安装之后，可以适用Terminal来确认一下你的SVN版本：svn --version