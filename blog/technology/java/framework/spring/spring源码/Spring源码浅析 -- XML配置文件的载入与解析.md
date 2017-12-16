#  [Spring源码浅析 -- XML配置文件的载入与解析](Spring源码浅析 -- XML配置文件的载入与解析.md)

发表时间：2010-08-21  

最近在看Spring源代码，对配置文件信息的载入是使用Spring的第一步 ，而这第一步就是一个非常复杂的过程.... 
Spring通过定义BeanDefination来管理Ioc中的各种对象以及它们之间的依赖关系，所以载入的过程其实就是将XML文件读取并解析成BeanDefination数据的过程。
我们以最常使用的ClassPathXmlApplicationContext为切入点 

## **1. 创建一个ClassPathXmlApplicationContext对象，传入文件路径**

  

Java代码  

```
ClassPathXmlApplicationContext re = new ClassPathXmlApplicationContext("applicationContext.xml");
```

这个构造方法会重载到

Java代码  

```
public ClassPathXmlApplicationContext(String[] configLocations, boolean refresh, ApplicationContext parent)  
        throws BeansException {  
  
    super(parent);  
    setConfigLocations(configLocations);  
    if (refresh) {  
        refresh();  
    }  
}  
```

 

其中首先设置配置路径 setConfigLocations(configLocations)  ，而后进行刷新 refresh()， 而这个refresh()方法是Ioc容器初始化的入口

## **2.refresh方法的结构**

 refresh方法由AbstractApplicationContext实现

Java代码  

```
public void refresh() throws BeansException, IllegalStateException {  
        synchronized (this.startupShutdownMonitor) {  
            // Prepare this context for refreshing.  
            prepareRefresh();  
  
            // Tell the subclass to refresh the internal bean factory.  
            ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();  
  
            // Prepare the bean factory for use in this context.  
            prepareBeanFactory(beanFactory);  
  
            try {  
                // Allows post-processing of the bean factory in context subclasses.  
                postProcessBeanFactory(beanFactory);  
  
                // Invoke factory processors registered as beans in the context.  
                invokeBeanFactoryPostProcessors(beanFactory);  
  
                // Register bean processors that intercept bean creation.  
                registerBeanPostProcessors(beanFactory);  
  
                // Initialize message source for this context.  
                initMessageSource();  
  
                // Initialize event multicaster for this context.  
                initApplicationEventMulticaster();  
  
                // Initialize other special beans in specific context subclasses.  
                onRefresh();  
  
                // Check for listener beans and register them.  
                registerListeners();  
  
                // Instantiate all remaining (non-lazy-init) singletons.  
                finishBeanFactoryInitialization(beanFactory);  
  
                // Last step: publish corresponding event.  
                finishRefresh();  
            }  
  
            catch (BeansException ex) {  
                // Destroy already created singletons to avoid dangling resources.  
                destroyBeans();  
  
                // Reset 'active' flag.  
                cancelRefresh(ex);  
  
                // Propagate exception to caller.  
                throw ex;  
            }  
        }  
    }  
```

 

 这个方法中描述了ApplicationContext的整个初始化过程，包括BeanFactory的更新，还有messagesource以及一些生命周期有关属性的注册，而我们关心的是BeanFactory的更新，即obtainFreshBeanFactory()方法

 

## **3.启动对BeanDefination的载入**

还是在ApplicationContext类中

Java代码  

```
protected ConfigurableListableBeanFactory obtainFreshBeanFactory() {  
    refreshBeanFactory();  
    ConfigurableListableBeanFactory beanFactory = getBeanFactory();  
    if (logger.isDebugEnabled()) {  
        logger.debug("Bean factory for " + getDisplayName() + ": " + beanFactory);  
    }  
    return beanFactory;  
}  
```

 它的第一步交给一个抽象方法refreshBeanFactory()， 具体的实现在AbstractRefreshableApplicationContext类中

 

Java代码  

```
@Override  
protected final void refreshBeanFactory() throws BeansException {  
    if (hasBeanFactory()) {  
        destroyBeans();  
        closeBeanFactory();  
    }  
    try {  
        DefaultListableBeanFactory beanFactory = createBeanFactory();  
        beanFactory.setSerializationId(getId());  
        customizeBeanFactory(beanFactory);  
        loadBeanDefinitions(beanFactory);  
        synchronized (this.beanFactoryMonitor) {  
            this.beanFactory = beanFactory;  
        }  
    }  
    catch (IOException ex) {  
        throw new ApplicationContextException("I/O error parsing bean definition source for " + getDisplayName(), ex);  
    }  
}  
```

第一步是判断是否已经创建过BeanFactory，如果是，将它销毁，重新创建
第二步就是创建各种ApplicationContext持有的真正容器实现类DefaultListableBeanFactory，创建Ioc容器

最后启动BeanDefination的载入  loadBeanDefinitions(beanFactory)方法

 

## **4.BeanFactory将载入工作交给BeanDefinationReader**

loadBeanDefinitions(beanFactory)方法是抽象的，又因为我们的配置文件是XML格式的，所以具体实现实在AbstractXmlApplicationConext中

Java代码  

```
@Override  
protected void loadBeanDefinitions(DefaultListableBeanFactory beanFactory) throws BeansException, IOException {  
    // Create a new XmlBeanDefinitionReader for the given BeanFactory.  
    XmlBeanDefinitionReader beanDefinitionReader = new XmlBeanDefinitionReader(beanFactory);  
  
    // Configure the bean definition reader with this context's  
    // resource loading environment.  
    beanDefinitionReader.setResourceLoader(this);  
    beanDefinitionReader.setEntityResolver(new ResourceEntityResolver(this));  
  
    // Allow a subclass to provide custom initialization of the reader,  
    // then proceed with actually loading the bean definitions.  
    initBeanDefinitionReader(beanDefinitionReader);  
    loadBeanDefinitions(beanDefinitionReader);  
}  
```

这里创建了一个XmlBeanDefinitionReader 对象，它专门用来读取基于XML文件格式的BeanDefinition配置，接下来重载到loadBeanDefinitions(beanDefinitionReader);

Java代码 

```
protected void loadBeanDefinitions(XmlBeanDefinitionReader reader) throws BeansException, IOException {  
    Resource[] configResources = getConfigResources();  
    if (configResources != null) {  
        reader.loadBeanDefinitions(configResources);  
    }  
    String[] configLocations = getConfigLocations();  
    if (configLocations != null) {  
        reader.loadBeanDefinitions(configLocations);  
    }  
}  
```

 

 首先载入Resource对象用来定位资源，Resource对象的生成在ClassPathXmlApplicationContext 中setConfigLocations(configLocations)方法实现

然后调用XmlBeanDefinitionReader基类AbstractBeanDefinitionReader的loadBeanDefinitions方法

Java代码  

```
public int loadBeanDefinitions(Resource[] resources) throws BeanDefinitionStoreException {  
    Assert.notNull(resources, "Resource array must not be null");  
    int counter = 0;  
    for (Resource resource : resources) {  
        counter += loadBeanDefinitions(resource);  
    }  
    return counter;  
}  
```

 

然后调用loadBeanDefinitions(resource)方法，此方法的具体实现在XmlBeanDefinitionReader 中

Java代码  

```
public int loadBeanDefinitions(Resource resource) throws BeanDefinitionStoreException {  
    return loadBeanDefinitions(new EncodedResource(resource));  
}  
```

  

重载到

Java代码   

```
public int loadBeanDefinitions(EncodedResource encodedResource) throws BeanDefinitionStoreException {  
        Assert.notNull(encodedResource, "EncodedResource must not be null");  
        if (logger.isInfoEnabled()) {  
            logger.info("Loading XML bean definitions from " + encodedResource.getResource());  
        }  
  
        Set<EncodedResource> currentResources = this.resourcesCurrentlyBeingLoaded.get();  
        if (currentResources == null) {  
            currentResources = new HashSet<EncodedResource>(4);  
            this.resourcesCurrentlyBeingLoaded.set(currentResources);  
        }  
        if (!currentResources.add(encodedResource)) {  
            throw new BeanDefinitionStoreException(  
                    "Detected recursive loading of " + encodedResource + " - check your import definitions!");  
        }  
        try {  
            InputStream inputStream = encodedResource.getResource().getInputStream();  
            try {  
                InputSource inputSource = new InputSource(inputStream);  
                if (encodedResource.getEncoding() != null) {  
                    inputSource.setEncoding(encodedResource.getEncoding());  
                }  
                return doLoadBeanDefinitions(inputSource, encodedResource.getResource());  
            }  
            finally {  
                inputStream.close();  
            }  
        }  
        catch (IOException ex) {  
            throw new BeanDefinitionStoreException(  
                    "IOException parsing XML document from " + encodedResource.getResource(), ex);  
        }  
        finally {  
            currentResources.remove(encodedResource);  
            if (currentResources.isEmpty()) {  
                this.resourcesCurrentlyBeingLoaded.set(null);  
            }  
        }  
    }  

```

 

 

在此类中主要是对输入流进行编码操作，然后调用doLoadBeanDefinitions(inputSource, encodedResource.getResource())方法

 

## **5.XmlBeanDefinitionReader将载入工作交给W3C的dom**

因为读入的文件是XML格式的，所以底层的实现肯定是要和W3C的dom结构打交道

doLoadBeanDefinitions(inputSource, encodedResource.getResource())方法正式引入dom

Java代码   

```
protected int doLoadBeanDefinitions(InputSource inputSource, Resource resource)  
            throws BeanDefinitionStoreException {  
        try {  
            int validationMode = getValidationModeForResource(resource);  
            Document doc = this.documentLoader.loadDocument(  
                    inputSource, getEntityResolver(), this.errorHandler, validationMode, isNamespaceAware());  
            return registerBeanDefinitions(doc, resource);  
        }  
        catch (BeanDefinitionStoreException ex) {  
            throw ex;  
        }  
        catch (SAXParseException ex) {  
            throw new XmlBeanDefinitionStoreException(resource.getDescription(),  
                    "Line " + ex.getLineNumber() + " in XML document from " + resource + " is invalid", ex);  
        }  
        catch (SAXException ex) {  
            throw new XmlBeanDefinitionStoreException(resource.getDescription(),  
                    "XML document from " + resource + " is invalid", ex);  
        }  
        catch (ParserConfigurationException ex) {  
            throw new BeanDefinitionStoreException(resource.getDescription(),  
                    "Parser configuration exception parsing XML from " + resource, ex);  
        }  
        catch (IOException ex) {  
            throw new BeanDefinitionStoreException(resource.getDescription(),  
                    "IOException parsing XML document from " + resource, ex);  
        }  
        catch (Throwable ex) {  
            throw new BeanDefinitionStoreException(resource.getDescription(),  
                    "Unexpected exception parsing XML document from " + resource, ex);  
        }  
    }  
```

在此方法中生成了Document类的对象，下一步是进行对象的注册，registerBeanDefinitions(doc, resource)方法

Java代码   

```
public int registerBeanDefinitions(Document doc, Resource resource) throws BeanDefinitionStoreException {  
    // Read document based on new BeanDefinitionDocumentReader SPI.  
    BeanDefinitionDocumentReader documentReader = createBeanDefinitionDocumentReader();  
    int countBefore = getRegistry().getBeanDefinitionCount();  
    documentReader.registerBeanDefinitions(doc, createReaderContext(resource));  
    return getRegistry().getBeanDefinitionCount() - countBefore;  
}  
```

 

此方法统计了注册的BeanDefinition的个数，返回一个int值，而具体的注册工作在BeanDefinitionDocumentReader 接口的实现类DefaultBeanDefinitionDocumentReader 中registerBeanDefinitions(doc, createReaderContext(resource))方法实现

 

## **6.BeanDefinitionDocumentReader将载入工作交给代理类BeanDefinationParserDelegate**

DefaultBeanDefinitionDocumentReader的registerBeanDefinitions(doc, createReaderContext(resource))方法

Java代码   

```
public void registerBeanDefinitions(Document doc, XmlReaderContext readerContext) {  
    this.readerContext = readerContext;  
  
    logger.debug("Loading bean definitions");  
    Element root = doc.getDocumentElement();  
  
    BeanDefinitionParserDelegate delegate = createHelper(readerContext, root);  
  
    preProcessXml(root);  
    parseBeanDefinitions(root, delegate);  
    postProcessXml(root);  
}  
```

 

其中首先得到dom结构的根，然后由根进行分析

然后引入BeanDefinitionParserDelegate 代理类对dom结构进行分析，调用parseBeanDefinitions(root, delegate)方法

Java代码   

```
protected void parseBeanDefinitions(Element root, BeanDefinitionParserDelegate delegate) {  
    if (delegate.isDefaultNamespace(delegate.getNamespaceURI(root))) {  
        NodeList nl = root.getChildNodes();  
        for (int i = 0; i < nl.getLength(); i++) {  
            Node node = nl.item(i);  
            if (node instanceof Element) {  
                Element ele = (Element) node;  
                String namespaceUri = delegate.getNamespaceURI(ele);  
                if (delegate.isDefaultNamespace(namespaceUri)) {  
                    parseDefaultElement(ele, delegate);  
                }  
                else {  
                    delegate.parseCustomElement(ele);  
                }  
            }  
        }  
    }  
    else {  
        delegate.parseCustomElement(root);  
    }  
} 
```

 其中最主要的操作是在调用parseDefaultElement(ele, delegate)方法中进行

Java代码  

```
private void parseDefaultElement(Element ele, BeanDefinitionParserDelegate delegate) {  
    if (delegate.nodeNameEquals(ele, IMPORT_ELEMENT)) {  
        importBeanDefinitionResource(ele);  
    }  
    else if (delegate.nodeNameEquals(ele, ALIAS_ELEMENT)) {  
        processAliasRegistration(ele);  
    }  
    else if (delegate.nodeNameEquals(ele, BEAN_ELEMENT)) {  
        processBeanDefinition(ele, delegate);  
    }  
}  
```

 

从这个方法里面我们就能看出来底层元素的端倪了，首先判断Node是否为import节点，然后是alias节点，最后是bean节点，我们关心的是bean节点，processBeanDefinition(ele, delegate)方法

Java代码   

```
protected void processBeanDefinition(Element ele, BeanDefinitionParserDelegate delegate) {  
    BeanDefinitionHolder bdHolder = delegate.parseBeanDefinitionElement(ele);  
    if (bdHolder != null) {  
        bdHolder = delegate.decorateBeanDefinitionIfRequired(ele, bdHolder);  
        try {  
            // Register the final decorated instance.  
            BeanDefinitionReaderUtils.registerBeanDefinition(bdHolder, getReaderContext().getRegistry());  
        }  
        catch (BeanDefinitionStoreException ex) {  
            getReaderContext().error("Failed to register bean definition with name '" +  
                    bdHolder.getBeanName() + "'", ele, ex);  
        }  
        // Send registration event.  
        getReaderContext().fireComponentRegistered(new BeanComponentDefinition(bdHolder));  
    }  
}  
```

 这里首先由BeanDefinitionParserDelegate 生成BeanDefination的包装类BeanDefinitionHolder ，然后再进行一些修饰工作，这里把工作正式交给BeanDefinitionParserDelegate

 

## **7.BeanDefinitionParserDelegate 中的解析工作**

BeanDefinition的解析主要在BeanDefinitionParserDelegate 的parseBeanDefinitionElement(ele)方法中进行，重载到

Java代码   

```
public BeanDefinitionHolder parseBeanDefinitionElement(Element ele, BeanDefinition containingBean) {  
    String id = ele.getAttribute(ID_ATTRIBUTE);  
    String nameAttr = ele.getAttribute(NAME_ATTRIBUTE);  
  
    List<String> aliases = new ArrayList<String>();  
    if (StringUtils.hasLength(nameAttr)) {  
        String[] nameArr = StringUtils.tokenizeToStringArray(nameAttr, BEAN_NAME_DELIMITERS);  
        aliases.addAll(Arrays.asList(nameArr));  
    }  
  
    String beanName = id;  
    if (!StringUtils.hasText(beanName) && !aliases.isEmpty()) {  
        beanName = aliases.remove(0);  
        if (logger.isDebugEnabled()) {  
            logger.debug("No XML 'id' specified - using '" + beanName +  
                    "' as bean name and " + aliases + " as aliases");  
        }  
    }  
  
    if (containingBean == null) {  
        checkNameUniqueness(beanName, aliases, ele);  
    }  
  
    AbstractBeanDefinition beanDefinition = parseBeanDefinitionElement(ele, beanName, containingBean);  
    if (beanDefinition != null) {  
        if (!StringUtils.hasText(beanName)) {  
            try {  
                if (containingBean != null) {  
                    beanName = BeanDefinitionReaderUtils.generateBeanName(  
                            beanDefinition, this.readerContext.getRegistry(), true);  
                }  
                else {  
                    beanName = this.readerContext.generateBeanName(beanDefinition);  
                    // Register an alias for the plain bean class name, if still possible,  
                    // if the generator returned the class name plus a suffix.  
                    // This is expected for Spring 1.2/2.0 backwards compatibility.  
                    String beanClassName = beanDefinition.getBeanClassName();  
                    if (beanClassName != null &&  
                            beanName.startsWith(beanClassName) && beanName.length() > beanClassName.length() &&  
                            !this.readerContext.getRegistry().isBeanNameInUse(beanClassName)) {  
                        aliases.add(beanClassName);  
                    }  
                }  
                if (logger.isDebugEnabled()) {  
                    logger.debug("Neither XML 'id' nor 'name' specified - " +  
                            "using generated bean name [" + beanName + "]");  
                }  
            }  
            catch (Exception ex) {  
                error(ex.getMessage(), ele);  
                return null;  
            }  
        }  
        String[] aliasesArray = StringUtils.toStringArray(aliases);  
        return new BeanDefinitionHolder(beanDefinition, beanName, aliasesArray);  
    }  
  
    return null;  
}  
```

 这个方法首先得到元素的name和id以及别名属性，然后再生成底层的AbstractBeanDefinition对象将它们包装生成BeanDefinitionHolder，其中包括bean的名称，别名，以及BeanDefinition，返回给上层方法

核心在于生成BeanDefinition的parseBeanDefinitionElement(ele, beanName, containingBean)方法

Java代码   

```
public AbstractBeanDefinition parseBeanDefinitionElement(  
        Element ele, String beanName, BeanDefinition containingBean) {  
  
    this.parseState.push(new BeanEntry(beanName));  
  
    String className = null;  
    if (ele.hasAttribute(CLASS_ATTRIBUTE)) {  
        className = ele.getAttribute(CLASS_ATTRIBUTE).trim();  
    }  
  
    try {  
        String parent = null;  
        if (ele.hasAttribute(PARENT_ATTRIBUTE)) {  
            parent = ele.getAttribute(PARENT_ATTRIBUTE);  
        }  
        AbstractBeanDefinition bd = createBeanDefinition(className, parent);  
  
        parseBeanDefinitionAttributes(ele, beanName, containingBean, bd);  
        bd.setDescription(DomUtils.getChildElementValueByTagName(ele, DESCRIPTION_ELEMENT));  
  
        parseMetaElements(ele, bd);  
        parseLookupOverrideSubElements(ele, bd.getMethodOverrides());  
        parseReplacedMethodSubElements(ele, bd.getMethodOverrides());  
  
        parseConstructorArgElements(ele, bd);  
        parsePropertyElements(ele, bd);  
        parseQualifierElements(ele, bd);  
  
        bd.setResource(this.readerContext.getResource());  
        bd.setSource(extractSource(ele));  
  
        return bd;  
    }  
    catch (ClassNotFoundException ex) {  
        error("Bean class [" + className + "] not found", ele, ex);  
    }  
    catch (NoClassDefFoundError err) {  
        error("Class that bean class [" + className + "] depends on not found", ele, err);  
    }  
    catch (Throwable ex) {  
        error("Unexpected failure during bean definition parsing", ele, ex);  
    }  
    finally {  
        this.parseState.pop();  
    }  
  
    return null;  
}  
```

 

 

这个方法我们看起来一目了然，全部都是bean节点中的配置信息

首先得到class的名字，然后得到继承的parent的名字，然后是meta节点，look-up节点，replaced-method节点，构造函数设置节点，最后是比较复杂的property节点，我们继续分析比较复杂的property节点的解析，parsePropertyElements(ele, bd)方法

Java代码  

```
public void parsePropertyElements(Element beanEle, BeanDefinition bd) {  
    NodeList nl = beanEle.getChildNodes();  
    for (int i = 0; i < nl.getLength(); i++) {  
        Node node = nl.item(i);  
        if (node instanceof Element && nodeNameEquals(node, PROPERTY_ELEMENT)) {  
            parsePropertyElement((Element) node, bd);  
        }  
    }  
}  
```

 将bean节点的子元素逐个取出判断是否为property节点，然后进行解析，parsePropertyElement((Element) node, bd)方法

Java代码   

```
public void parsePropertyElement(Element ele, BeanDefinition bd) {  
    String propertyName = ele.getAttribute(NAME_ATTRIBUTE);  
    if (!StringUtils.hasLength(propertyName)) {  
        error("Tag 'property' must have a 'name' attribute", ele);  
        return;  
    }  
    this.parseState.push(new PropertyEntry(propertyName));  
    try {  
        if (bd.getPropertyValues().contains(propertyName)) {  
            error("Multiple 'property' definitions for property '" + propertyName + "'", ele);  
            return;  
        }  
        Object val = parsePropertyValue(ele, bd, propertyName);  
        PropertyValue pv = new PropertyValue(propertyName, val);  
        parseMetaElements(ele, pv);  
        pv.setSource(extractSource(ele));  
        bd.getPropertyValues().addPropertyValue(pv);  
    }  
    finally {  
        this.parseState.pop();  
    }  
}  
```

解析的主要过程，首先判断是否重复，如果重复抛出异常，然后对property节点内部进行解析，最后加入到bean节点信息中，我们继续解析property节点内部，parsePropertyValue(ele, bd, propertyName)方法

Java代码   

```
public Object parsePropertyValue(Element ele, BeanDefinition bd, String propertyName) {  
    String elementName = (propertyName != null) ?  
                    "<property> element for property '" + propertyName + "'" :  
                    "<constructor-arg> element";  
  
    // Should only have one child element: ref, value, list, etc.  
    NodeList nl = ele.getChildNodes();  
    Element subElement = null;  
    for (int i = 0; i < nl.getLength(); i++) {  
        Node node = nl.item(i);  
        if (node instanceof Element && !nodeNameEquals(node, DESCRIPTION_ELEMENT) &&  
                !nodeNameEquals(node, META_ELEMENT)) {  
            // Child element is what we're looking for.  
            if (subElement != null) {  
                error(elementName + " must not contain more than one sub-element", ele);  
            }  
            else {  
                subElement = (Element) node;  
            }  
        }  
    }  
  
    boolean hasRefAttribute = ele.hasAttribute(REF_ATTRIBUTE);  
    boolean hasValueAttribute = ele.hasAttribute(VALUE_ATTRIBUTE);  
    if ((hasRefAttribute && hasValueAttribute) ||  
            ((hasRefAttribute || hasValueAttribute) && subElement != null)) {  
        error(elementName +  
                " is only allowed to contain either 'ref' attribute OR 'value' attribute OR sub-element", ele);  
    }  
  
    if (hasRefAttribute) {  
        String refName = ele.getAttribute(REF_ATTRIBUTE);  
        if (!StringUtils.hasText(refName)) {  
            error(elementName + " contains empty 'ref' attribute", ele);  
        }  
        RuntimeBeanReference ref = new RuntimeBeanReference(refName);  
        ref.setSource(extractSource(ele));  
        return ref;  
    }  
    else if (hasValueAttribute) {  
        TypedStringValue valueHolder = new TypedStringValue(ele.getAttribute(VALUE_ATTRIBUTE));  
        valueHolder.setSource(extractSource(ele));  
        return valueHolder;  
    }  
    else if (subElement != null) {  
        return parsePropertySubElement(subElement, bd);  
    }  
    else {  
        // Neither child element nor "ref" or "value" attribute found.  
        error(elementName + " must specify a ref or value", ele);  
        return null;  
    }  
}  
```

property节点主要是value和ref属性的配置，所以此方法首先是配置以上两个属性，然后是分析property节点的子元素，parsePropertySubElement(subElement, bd)方法，重载到

Java代码   

```
public Object parsePropertySubElement(Element ele, BeanDefinition bd, String defaultValueType) {  
    if (!isDefaultNamespace(getNamespaceURI(ele))) {  
        return parseNestedCustomElement(ele, bd);  
    }  
    else if (nodeNameEquals(ele, BEAN_ELEMENT)) {  
        BeanDefinitionHolder nestedBd = parseBeanDefinitionElement(ele, bd);  
        if (nestedBd != null) {  
            nestedBd = decorateBeanDefinitionIfRequired(ele, nestedBd, bd);  
        }  
        return nestedBd;  
    }  
    else if (nodeNameEquals(ele, REF_ELEMENT)) {  
        // A generic reference to any name of any bean.  
        String refName = ele.getAttribute(BEAN_REF_ATTRIBUTE);  
        boolean toParent = false;  
        if (!StringUtils.hasLength(refName)) {  
            // A reference to the id of another bean in the same XML file.  
            refName = ele.getAttribute(LOCAL_REF_ATTRIBUTE);  
            if (!StringUtils.hasLength(refName)) {  
                // A reference to the id of another bean in a parent context.  
                refName = ele.getAttribute(PARENT_REF_ATTRIBUTE);  
                toParent = true;  
                if (!StringUtils.hasLength(refName)) {  
                    error("'bean', 'local' or 'parent' is required for <ref> element", ele);  
                    return null;  
                }  
            }  
        }  
        if (!StringUtils.hasText(refName)) {  
            error("<ref> element contains empty target attribute", ele);  
            return null;  
        }  
        RuntimeBeanReference ref = new RuntimeBeanReference(refName, toParent);  
        ref.setSource(extractSource(ele));  
        return ref;  
    }  
    else if (nodeNameEquals(ele, IDREF_ELEMENT)) {  
        return parseIdRefElement(ele);  
    }  
    else if (nodeNameEquals(ele, VALUE_ELEMENT)) {  
        return parseValueElement(ele, defaultValueType);  
    }  
    else if (nodeNameEquals(ele, NULL_ELEMENT)) {  
        // It's a distinguished null value. Let's wrap it in a TypedStringValue  
        // object in order to preserve the source location.  
        TypedStringValue nullHolder = new TypedStringValue(null);  
        nullHolder.setSource(extractSource(ele));  
        return nullHolder;  
    }  
    else if (nodeNameEquals(ele, ARRAY_ELEMENT)) {  
        return parseArrayElement(ele, bd);  
    }  
    else if (nodeNameEquals(ele, LIST_ELEMENT)) {  
        return parseListElement(ele, bd);  
    }  
    else if (nodeNameEquals(ele, SET_ELEMENT)) {  
        return parseSetElement(ele, bd);  
    }  
    else if (nodeNameEquals(ele, MAP_ELEMENT)) {  
        return parseMapElement(ele, bd);  
    }  
    else if (nodeNameEquals(ele, PROPS_ELEMENT)) {  
        return parsePropsElement(ele);  
    }  
    else {  
        error("Unknown property sub-element: [" + ele.getNodeName() + "]", ele);  
        return null;  
    }  
}  
```

 

 这个方法内部也是一目了然，首先是配置property节点的内嵌bean，然后配置ref引用，然后是idref引用，接下来是内嵌的value元素，还有null元素，最后是一系列的复杂数据类型，array，list，set，map以及props。

 

到这里配置文件的载入基本上已经到底了，如果对以上元素的配置感兴趣的话，可以继续查看源代码。这里只是包含配置文件的载入过程，并不包括在Ioc容器中的注册，以及依赖注入的过程。

来源： <http://www.iteye.com/topic/743997>