# Centos开机自启动redis

 

## 修改redis.conf

打开后台运行选项：

```
	# By default Redis does not run as a daemon. Use 'yes' if you need it.

	# Note that Redis will write a pid file in /var/run/redis.pid when daemonized.

	daemonize yes
```

## 编写脚本

，vim /etc/init.d/redis:

```

# chkconfig: 2345 10 90

# description: Start and Stop redis

 

PATH=/usr/local/bin:/sbin:/usr/bin:/bin

 

REDISPORT=6379 #实际环境而定

EXEC=/usr/local/redis-2.8.17/src/redis-server #实际环境而定

REDIS_CLI=/usr/local/redis-2.8.17/src/redis-cli #实际环境而定

 

PIDFILE=/var/run/redis.pid

CONF="/usr/local/redis-2.8.17/redis.conf" #实际环境而定

 

case "$1" in

        start)

                if [ -f $PIDFILE ]

                then

                        echo "$PIDFILE exists, process is already running or crashed."

                else

                        echo "Starting Redis server..."

                        $EXEC $CONF

                fi

                if [ "$?"="0" ]

                then

                        echo "Redis is running..."

                fi

                ;;

        stop)

                if [ ! -f $PIDFILE ]

                then

                        echo "$PIDFILE exists, process is not running."

                else

                        PID=$(cat $PIDFILE)

                        echo "Stopping..."

                        $REDIS_CLI -p $REDISPORT SHUTDOWN

                        while [ -x $PIDFILE ]

                        do

                                echo "Waiting for Redis to shutdown..."

                                sleep 1

                        done

                        echo "Redis stopped"

                fi

                ;;

        restart|force-reload)

                ${0} stop

                ${0} start

                ;;

        *)

                echo "Usage: /etc/init.d/redis {start|stop|restart|force-reload}" >&2

                exit 1

esac
```

## 执行权限：

```
chmod +x /etc/init.d/redis
```

## 开机自启动：

```
	# 尝试启动或停止redis

	service redis start

	service redis stop

	 

	# 开启服务自启动

	chkconfig redis on
```

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4688376.html