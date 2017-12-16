```
<if test="isExpired=='Y'">
and msg.expire_time &lt; now()
</if>
会报NumberFormatException，这样就可以了。
<if test="isExpired=='Y'.toString()">
and msg.expire_time &lt; now()
</if>
```

