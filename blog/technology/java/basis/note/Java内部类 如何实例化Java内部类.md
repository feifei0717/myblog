假设外部类叫Out，内部类叫In，那么我们可以使用Out.In in = new Out().new In()来实例化内部类的对象，具体示例代码如下：

```
public class Out {
    private int age = 12;
    class In {
        private int age = 13;
        public void print() {
            int age = 14;
            System.out.println("局部变量：" + age);
            System.out.println("内部类变量：" + this.age);
            System.out.println("外部类变量：" + Out.this.age);
        }
    }
}
class Demo {
    public static void main(String[] args) {
        Out.In in = new Out().new In();
        in.print();
    }
}
```

来源： <<http://zhidao.baidu.com/question/239916406922123804.html>>

 