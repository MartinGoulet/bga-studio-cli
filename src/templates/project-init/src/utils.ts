function createCounter(id: string | HTMLElement, value: number = 0): ebg.counter {
   const counter = new ebg.counter();
   counter.create(id);
   counter.setValue(value);
   return counter;
}

// this goes outside dojo class - before or after
function reloadCss() {
   const links = document.getElementsByTagName('link');
   for (var cl in links) {
      var link = links[cl];
      if (link.rel === 'stylesheet' && link.href.includes('99999')) {
         var index = link.href.indexOf('?timestamp=');
         var href = link.href;
         if (index >= 0) {
            href = href.substring(0, index);
         }

         link.href = href + '?timestamp=' + Date.now();

         console.log('reloading ' + link.href);
      }
   }
}
