_inline_object_regAllInterfaceForClass: {

    // register interfaces for Class's all instnaces
    if (arguments.length > 2) {
      Interface.RegisterInterface.apply(null, [cls.Create].concat(
        Array.prototype.slice.call(arguments, 2)
      ))
    }

}