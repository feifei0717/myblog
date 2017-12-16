php中可使用call_user_func进行方法的动态调用，可以动态调用普通函数、类方法以及带参数的类方法。

## 工具/原料

- php

## 方法/步骤

1. ​

   1，定义一个普通函数getCurrentDate，用于获取今天日期。

   call_user_func带上的参数为要被调用的函数名。

   [![php中怎么使用call_user_func动态调用方法](image-201711220953/ac33cfce-c968-4f0d-8b19-574c8a19d5e4.jpg)](file:///C:/album/6c67b1d697a0b32786bb1e77.html?picindex=1)

2. ​

   程序会自动执行getCurrentDate函数并获得期望的结果。

   [![php中怎么使用call_user_func动态调用方法](image-201711220953/ea22e805-2754-4d4b-bed1-70614add9557.jpg)](file:///C:/album/6c67b1d697a0b32786bb1e77.html?picindex=2)

3. ​

   2，定义一个类Cls150521及类方法getTitle，call_user_func的输入参数变为一个数组，数组第一个元素为对象名、第二个元素为类方法名。

   [![php中怎么使用call_user_func动态调用方法](image-201711220953/68630c86-f4f0-4afa-9fac-eaef3cfc88af.jpg)](file:///C:/album/6c67b1d697a0b32786bb1e77.html?picindex=3)

4. ​

   程序会自动调用对象$cls150521的方法getTitle()，并获得期望结果。

   [![php中怎么使用call_user_func动态调用方法](image-201711220953/f1f5aeee-3585-44f8-baca-b645df27a711.jpg)](file:///C:/album/6c67b1d697a0b32786bb1e77.html?picindex=4)

5. ​

   3,也可调用带参数的方法，此时将getTitle方法改为getTitle($title)。

   调用时，加上第二个参数，就是需要传给方法的参数。

   [![php中怎么使用call_user_func动态调用方法](image-201711220953/b483ba3d-afb7-4a38-890c-9cddac236c0c.jpg)](file:///C:/album/6c67b1d697a0b32786bb1e77.html?picindex=5)

6. ​

   传入的参数为abc，可获得期望的结果：

   Cls150521.getTitle:abc

   [![php中怎么使用call_user_func动态调用方法](image-201711220953/fb51373d-17fa-47ce-9840-b5efbc2e3828.jpg)](file:///C:/album/6c67b1d697a0b32786bb1e77.html?picindex=6)

   END

   ​

   来源： <<http://jingyan.baidu.com/article/6c67b1d697a0b32786bb1e77.html>>

    