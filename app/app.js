

$(document).ready(function() {
  $.getJSON('toms.php', function(data, status){
    createTable(data)
  })
  .always(function(data, status) {
    if(status==='error'){
      $('#dataTableContainer').text('Could not create data table');
    }
  })

  function createTable(data){
    var arrayedData = Object.values(data).map(function(object){
      return Object.values(object);
    });

    // create the col headings;
    var obj = Object.values(data)[0]
    var cols = Object.keys(obj);
    cols.push('Action')

    var colTitles = cols.map(function(col){
        return { title: '<label>'+col+'</label>'}
    });
    
    // create the col definitions;
    var colDefs = cols.map(function(col, i){
      var l = cols.length
      if(i === 0){
        return {
          "className": "highlight",
          "targets":   i,
        }
      }else if ( i === ( l-1)){
        return  {
          'orderable': true,
          "targets": -1,
          "defaultContent": "<button class='btn btn-info action btn-xs'>Action</button>",
        }
      } else {
        return {
          "targets": i,
          'orderable': true,
        }
      }
    })
    var table = $('#example').DataTable({
        data:  arrayedData,
        dom: 'f<"toolbar btn-group">lrtBip',
        buttons: [
          {
            'extend':'columnsToggle',
          },
          {
            extend: 'excel',
            header: false,
            text: 'excel',
            exportOptions: {
              modifier: {
                selected: true,
              },
              columns: [0,1,2,3,4,5,6,7,8],
            }
          },
          {
            extend: 'pdf',
            header: false,
            text: 'pdf',
            exportOptions: {
              modifier: {
                selected: true,
              },
              columns: [0,1,2,3,4,5,6,7,8],
            }
          },
        ],
        fixedHeader: {
          header: true,
        },
        columnDefs: colDefs,
        select: {
          style:    'multi',
          selector: 'tr',
        },
        pageLength: 25,
        order: [],
        columns: colTitles,
        autoWidth: true,
      });
      
      $('.action').on('click', function(e){ 
        var row = $(this).closest('tr'); 
        var studentName = getRowValues(row);
          alert(studentName);
      });

      var reset = $('<button class="btn btn-default"> Reset</button>').on('click', function(){
          removeAllClass();
          table.search('').draw();
      }).appendTo($("div.toolbar"));

      var highest = $('<button class="btn btn-default"> Highest</button>').on('click', function(){
        highestInEachRow();
      }).appendTo($("div.toolbar"));

      var lowest = $('<button class="btn btn-default"> Lowest</button>').on('click', function(){
        lowestInEachRow();
      }).appendTo($("div.toolbar"));

      var rotate = $('<button class="btn btn-default">Rotate</button>').on('click', function(){
        $('th').hasClass('tallHeader') ? rotateHeadings('horizontal') : rotateHeadings('vertical');
      }).appendTo($("div.toolbar"));

      var rangeInput = $('<input type="number" class="rangeInput input-sm" placeholder="number" width="30"></input>').appendTo($("div.toolbar"));
      var rangeDropDown =$(
        '<select class="rangepicker btn-sm" data-width="fit">\
          <option>greater than</option>\
          <option>less than</option>\
        </select>'
        ).appendTo($("div.toolbar"));


      function getRowNumberValues(row){
        var rowNumbers = [];
        row.find('td').each(function(i, item) {
          var val = Number(item.innerHTML);
          if(!isNaN(val)){
            rowNumbers.push(val);
          }
        });
        return rowNumbers;
      }

      function getRowValues(row){
        var rowNumbers = [];
        row.find('td').each(function(i, item) {
          rowNumbers.push(item.innerHTML);
        });
        return rowNumbers.slice(0,-1);
      }

      function removeAllClass(){
        $('tbody td').each(function(i,item) {
          $(item).removeClass('largest');
          $(item).removeClass('smallest');
          $(item).removeClass('meetsCondition');
        });
      }

      function highestInEachRow(){
        $('tr').each(function(i, item){
          var rowNumbers  = getRowNumberValues($(this));
          var largest = returnLargest(rowNumbers);
          addClassToVal(largest, $(this),'largest');
        });
      }

      function lowestInEachRow(){
        $('tr').each(function(i, item){
          var rowNumbers  = getRowNumberValues($(this));
          var smallest = returnSmallest(rowNumbers);
          addClassToVal(smallest, $(this),'smallest');
        });
      }

      function addClassToVal(val, row, className){
        row.find('td').each(function(i,item) {
          if (Number(item.innerHTML) == val){
            $(this).addClass(className);
          }
        });
      }

      function returnLargest(arr){
        return arr.reduce(function(p,c) {
          return p > c ? p : c ;
        },0);
      }

      function returnSmallest(arr){
        return arr.sort(function(a,b){ return a - b;})[0];
      }

      function rotateHeadings(dir){
        if(dir === 'vertical'){
          $('thead label').each(function(i, item){
            $(item).addClass('rotateCol');
          })
          $('th').each(function(i, item){
            $(item).addClass('tallHeader');
          })
        }else{
          $('thead label').each(function(i, item){
            $(item).removeClass('rotateCol');
          })
          $('th').each(function(i, item){
            $(item).removeClass('tallHeader');
          })
        }
      }

      $(window).on('load, resize',function(){
        var tableWidth = $('.table').outerWidth();
        var windowWidth =  $(window).width();
        if(tableWidth > windowWidth) {
          rotateHeadings('vertical');
        } else {
          rotateHeadings('horizontal');
        }
      })

      $('thead tr th').each(function(i, item){
        var lastItem = $('th:last');
        lastItem.css('position', 'relative');
        if ( i !== 10){
          var colData = table.columns(i).data()[0].sort();
          flag = [],  i;
          var select = $('<select class="selectpicker" data-style="btn-xs" data-width="fit" multiple></select>');
          colData.forEach(function(item, i) {
            if(flag[colData[i]]) return ;
            flag[colData[i]] = true;
            select.append( '<option>'+item+'</option>' );
          });
          $(this).append(select);
        }
      });

      $('.selectpicker').on('change', function(e){
        var  selected = $('.selected .text');
        values = [];
        selected.each(function(i, item){
          values.push(item.innerHTML);
        });
        table
        .search( values.length > 0 ? values.join('|') : values, true, false)
        .draw();
      });

      var colsToFilter = [2,3,4,5];

      function addCondtion(value,operator){
        removeAllClass();
        $('tr').each(function(i, item){
          var row = $(this);
          var filtered = getRowNumberValues(row).filter(function(data){
            if(operator === 'greater than'){
              return data > value;
            } else {
              return data < value;
            }
          })
          filtered.forEach(function(match){
            addClassToVal(match, row, 'meetsCondition');
          })
        });
      }

      $('.rangepicker').on('change', function(e){
          var value = Number($('.rangeInput').val());
          var operator = e.target.value;
          addCondtion(value, operator);
      });

      $('.rangeInput').on('change', function(e){
          var operator = $('.rangepicker').val();
          var value = e.target.value;
          addCondtion(value, operator);
      });

      $(".selectpicker").selectpicker({
          title: '',
      });
    }
});
