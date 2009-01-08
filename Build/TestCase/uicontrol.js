// 选项间的限制与约束
document.getElementsByName('SkipCompress')[0].onclick = function() {
  document.getElementsByName('ClearComment')[0].disabled = !this.checked;
}

document.getElementsByName('IeAabsolutePath')[0].onclick = function() {
  var el_prot = document.getElementsByName('Protocol')[0];
  if (document.getElementsByName('IeAabsolutePath')[0].checked) {
    el_prot.disabled = true;
    el_prot.checked = true;
  }
  else {
    el_prot.disabled = false;
    el_prot.checked = false;
  }
}

document.getElementsByName('CompatLayer')[0].onclick = function() {
  var el_fw = document.getElementsByName('IncludeFramework')[0];
  var el_path = document.getElementsByName('IeAabsolutePath')[0];
  var el_decode = document.getElementsByName('IeDecode')[0];
  if (document.getElementsByName('CompatLayer')[0].checked) {
    el_fw.disabled = false;
    el_fw.checked = true;
    el_path.disabled = false;
    el_decode.disabled = false;
  }
  else {
    el_fw.disabled = true;
    el_fw.checked = false;
    el_path.disabled = true;
    el_path.checked = false;
    el_decode.disabled = true;
    el_decode.checked = false;
  }
}

document.getElementsByName('Debugging')[0].onclick = function() {
  var el_prof = document.getElementsByName('Profiling')[0];
  var el_impt = document.getElementsByName('RepImport')[0];
  if (document.getElementsByName('Debugging')[0].checked) {
    el_prof.checked = true;
    el_impt.checked = true;
    el_prof.disabled = false;
    el_impt.disabled = false;
  }
  else {
    el_prof.checked = false;
    el_impt.checked = false;
    el_prof.disabled = true;
    el_impt.disabled = true;
  }
}

document.getElementById('box').onclick = function() {
  if (event.srcElement.tagName=='INPUT') {
    with (document.getElementsByName('NoneImport')[0]) {
      var enabled = !document.getElementsByName('IncludeFramework')[0].checked &&
                    !document.getElementsByName('IeAabsolutePath')[0].checked &&
                    !document.getElementsByName('IeDecode')[0].checked &&
                    !document.getElementsByName('Debugging')[0].checked &&
                    !document.getElementsByName('Namespace')[0].checked;
      
      disabled = !enabled;
      if (disabled) checked = false;
    }
    document.getElementsByName('NoneAjax')[0].disabled = 
      !document.getElementsByName('NoneImport')[0].checked;
  }
}

document.getElementsByName('checkAll')[0].onclick = function() {
  var tag = event.srcElement.checked;
  var all = document.getElementById('box').all.tags('INPUT');
  for (var i=0; i<all.length; i++) {
    if (all[i].className != 'opt') continue;
    if (!all[i].disabled && all[i].type == 'checkbox') {
      all[i].checked = tag;
    }
  }
  // document.getElementsByName('ClearComment')[0].disabled = false;
}
