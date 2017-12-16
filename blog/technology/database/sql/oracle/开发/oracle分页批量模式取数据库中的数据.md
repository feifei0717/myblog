```java
            //1、加载驱动程序
            Class.forName("oracle.jdbc.driver.OracleDriver");
            //2、获取连接
            con = DriverManager.getConnection(url, user, password);
            //3、创建并执行SQL
            sm = con.createStatement();
            //查询总记录数
            int totalRecords = getTotalRecords();
            //每页多少条数据
            int pageSize = 500;
            //一共多少页
            int page = (totalRecords % pageSize == 0) ? (totalRecords / pageSize)
                : (totalRecords / pageSize) + 1;
            for (int i = 0; i < page; i++) {
                int fromIndex = pageSize * i;//第几条数据开始查询
                int toIndex = pageSize * (i + 1) > totalRecords ? totalRecords : pageSize * (i + 1);//第几条数据结束查询
                rs = sm.executeQuery(" SELECT * FROM ( SELECT A.*, ROWNUM RN FROM (\n" + "   \n"
                                     + "SELECT sm_seq FROM UCORD.SHOW_MAIN m WHERE m.islifeexpired='0'\n"
                                     + "\n" + "\n" + " ) A WHERE ROWNUM <= " + toIndex
                                     + " ) WHERE RN > " + fromIndex + "" + "");
                while (rs.next()) {
                    String smSeq = rs.getString("sm_seq");
                    FileUtils.writeStringToFile(
                        new File(
                            "E:\\workspace\\commodity_improve_sxj_20160329\\commodity-v2\\src\\test\\java\\com\\feiniu\\soa\\commodity\\v2\\smSeqData.txt"),
                        smSeq + ",", Charsets.UTF_8, true);
                }
            }

```

