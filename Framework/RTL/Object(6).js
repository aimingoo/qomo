_inline_object_registerToActiveNamespace: {

    var activeSpc = $import_getter('activeSpc');
    if (activeSpc) {
      var spc = activeSpc();
      cls.SpaceName = spc.toString();
      spc[cls.ClassName] = cls;
    }

}