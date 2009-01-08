/**
 * Core loader config
 */
void function($conf) {
  var conf = $conf ? $conf : {
    isDebugging: false,       // 系统调试
    isProfiling: false,       // 性能分析
    isBuilding: false,        // 生成编译(^.^)过的代码
    isNoneImport: false,      // 没有$import()和$inline()代码块
    isNoneAjax: false,        // 没有Ajax()代码块
    hasRepImport: false,      // 重写$import()以便性能分析
    hasOutputDebug: true,     // 使用$debug()输出代码中的调试信息

    hasIeAabsolutePath: false,// IE绝对路径支持
    hasIeDecode: false,       // IE解码器支持(目前只支持gb2312->utf8)
    hasInterface: true,       // 接口模块
    hasError: true,           // 错误、异常和断言控制模块
    hasProtocol: true,        // 地址协议模块
    hasCompatLayer: true,     // 兼容层
    hasNamespace: true,       // 命名空间模块
    hasAspect: true,          // 切面
    hasTemplet: true,         // 模板
    hasCommonClasses: true,   // 公共类库
    hasDatabase: true,
    hasGraphics: true,
    hasControls: true         // 系统组件
  };

  return ($Q = $QomoConfig = function(module) {
    var $q = arguments.callee;
    switch (module) {
      // depended
      case 'Profiling' : return conf.isProfiling;
      case 'Building'  : return conf.isBuilding;
      case 'NoneImport': return conf.isNoneImport;
      case 'NoneAjax'  : return $q('NoneImport') && conf.isNoneAjax;
      case 'Debugging' : return $q('Profiling') || conf.isDebugging;

      case 'Interface'  : return $q('Aspect') ||  $q('Templet') || conf.hasInterface;
      case 'Protocol'   : return $q('IeAabsolutePath') || conf.hasProtocol;
      case 'Aspect'     : return $q('HtmlComponent') || conf.hasAspect;
      case 'Templet'    : return $q('HtmlComponent') || conf.hasTemplet;

      case 'CommonClasses':  return $q('HtmlComponent') ||  $q('Database') ||  $q('Graphics') || conf.hasCommonClasses;

      // depend other module
      case 'JoPoints' : return $q('Aspect');
      case 'HtmlComponent': return $q('Controls');

      default: return conf['has'+module];
    }
  })
}(typeof($QomoConfig) == 'undefined' ? null : $QomoConfig);