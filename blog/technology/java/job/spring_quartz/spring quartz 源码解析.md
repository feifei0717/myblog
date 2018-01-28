[TOC]



# spring quartz 源码解析

## 介绍

Quartz使用Trigger，Job和JobDetail对象来实现各种作业的调度。 对于Quartz背后的基本概念，请看http://quartz-scheduler.org。 为了方便起见，Spring提供了几个类来简化基于Spring的应用程序中Quartz的使用。

## 主要类:

- MethodInvokingJobDetailFactoryBean
  - job细节工厂bean ,通常你只需要调用特定对象的方法。 使用MethodInvokingJobDetailFactoryBean你可以做到这一点.
- CronTriggerFactoryBean和SimpleTriggerFactoryBean
  - CronTriggerFactoryBean: cron 规则的触发器 工厂bean
  - SimpleTriggerFactoryBean: 简单的触发器工厂bean
- SchedulerFactoryBean
  - 调度程序工厂Bean, 触发器需要安排。 Spring提供了一个SchedulerFactoryBean，它将触发器设置为属性。 SchedulerFactoryBean使用这些触发器来安排实际的作业。
  - 就是用来管理 jobDetail 和 trigger 的调度程序



## 启动流程

SchedulerFactoryBean初始化.调用afterPropertiesSet() 方法进行初始化操作