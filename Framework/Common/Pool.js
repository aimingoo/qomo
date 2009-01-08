/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2007.01.31]

 - Common Class: TPool, 
 - Define Machine prototype and events, states
*****************************************************************************/

// var
  TMachineStateChange = function(state) {};
  TPoolStateChange = function(mac, state) {};

function Pool() {
  Attribute(this, 'Size', 0, 'rw');
  Attribute(this, 'FIFO', true, 'rw');

  Attribute(this, 'DataPool', null, 'rw');
  Attribute(this, 'BusyMachine', null, 'rw');
  Attribute(this, 'MachineQueue', null, 'rw');
  Attribute(this, 'MachineClass', null, 'rw');

  this.OnStateChange = TPoolStateChange;

  var Hook_MachineStateChange = function(state) {
    // 1. resume fire by pool
    if (state=='resume') return;

    // 2. fire pool.OnStateChange()
    var mac=this, pool=mac.pool;
    pool.OnStateChange(mac, state);

    // 3. is "sleep", release the data.
    if (state=='sleep')
      release.call(pool, mac);
    else if (state=='free')
      pool.get('BusyMachine').remove(mac);
  }

  var release = function(mac) {
    // scan DataPool, try process a data.
    if (mac.data = (this.get('FIFO') ? this.get('DataPool').shift() : this.get('DataPool').pop())) {
      this.OnStateChange(mac, 'resume');
      mac.OnStateChange('resume');
    }
    else {
      // or, reclaime a mac(hine)
      mac.data = mac.pool = null;
      this.get('BusyMachine').remove(mac);
      this.get('MachineQueue').push(mac);
    }
  }

  var require = function () {
    with (this.get('MachineQueue')) {
      if (length>0) return pop();
    }

    if (this.get('BusyMachine').length < this.get('Size')) {
      var cls = this.get('MachineClass');
      var mac = cls.Create.apply(cls, arguments);
      mac.OnStateChange.add(Hook_MachineStateChange);
      return mac;
    }
  }

  // push a data block.
  // if have sleeped machine, the launch machine with the data block.
  this.push = function(data) {
    var mac = require.call(this);
    if (!mac)
      this.get('DataPool').push(data);
    else {
      this.get('BusyMachine').push(mac);

      mac.pool = this;
      mac.data = data;

      mac.pool.OnStateChange(mac, 'resume');
      mac.OnStateChange('resume');
    }
  }

  this.Create = function(cls, size) {
    this.set('MachineClass', cls);
    this.set('MachineQueue', new Array());
    this.set('BusyMachine', new Array());
    this.set('DataPool', new Array());

    this.set('Size', isNaN(size)?0:+size);
  }
}

TPool = Class(TObject, 'Pool');