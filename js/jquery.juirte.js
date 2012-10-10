$.fn.wysiwyg = function(options){
	// based on the example @ http://stackoverflow.com/questions/5281438/how-to-create-a-text-editor-in-jquery
	var settings = $.extend({
		width : "400",
		height : "200px",
		fonts : ["Arial","Comic Sans MS","Courier New","Monotype Corsiva","Tahoma","Times"],
		showfonts: false,
		buttons: ['justifyCenter', 'justifyFull', 'justifyLeft', 'justifyRight', 'italic', 'bold', 'underline', 'strikeThrough', 'insertHorizontalRule', 'insertOrderedList', 'insertUnorderedList']
		//buttons: ['justifyCenter', 'justifyFull', 'justifyLeft', 'justifyRight', 
		//'indent', 'outdent', 'superscript', 'subscript', 'selectAll', 
		//'removeFormat', 'insertOrderedList', 'insertUnorderedList', 'insertHorizontalRule']
	}, options);
/*
'undo', 'redo', 'delete', 'cut', 'copy', 'paste',
createLink
hiliteColor
formatBlock
foreColor
fontSize
insertImage,  'insertParagraph'
, 'increasefontsize', 'decreaseFontSize', 'heading' 
*/


	return this.each(function(){

		if($(this).css('width')) settings.width=$(this).css('width');
		if($(this).css('height')) settings.height=$(this).css('height');

		var _id=$(this).attr('id');
		var $this = $(this).hide();

		var containerDiv = $("<div/>",{
			class: 'ui-wysiwyg ui-widget ui-widget-content ui-corner-top ',
			css : {
				width : settings.width ,
				height : settings.height
			}
		}).resizable();
       $this.before(containerDiv); 

       var editor = $("<iframe/>",{
   			css : { height: '100%', width: '100%' },
			frameborder : "0",
		   class: _id+'-wysiwyg-content ui-wysiwyg-content ',
       }).appendTo(containerDiv).get(0);

		editor.contentWindow.document.open();
		if($(this).val()) editor.contentWindow.document.write($(this).val());
		editor.contentWindow.document.close();
		editor.contentWindow.document.designMode="on";

		$('.'+_id+'-wysiwyg-content').contents().find('body').bind("keyup keydown keypress focus blur", function(e) {
			$('#'+_id).val($('.ui-wysiwyg-content').contents().find('body').html());
		})
	  
		var wysiwyg_menu = $("<div/>",{
			"class" : "ui-widget ui-widget-content ui-widget-header ui-corner-bottom  ui-wysiwyg-menu",
			css : { width : '100%' }
		}).appendTo(containerDiv);


		var buttonPane = $("<div/>",{
			"class" : "ui-wysiwyg-menu-buttonset",
			css : {
				width : '100%'
			}
		}).appendTo(wysiwyg_menu);

		//containerDiv.append($('<div/>', { 'class': 'ui-helper-clearfix', css: { 'height': '100px', 'border': '1px solid blue'}}));

		$.each(settings.buttons,function(i,v){
			var _options=fnGetButton(v);
			$("<a/>",{
				href : "#",
				text : _options.text,
				data : {
					commandName : v,
					commandValue: _options.value
				},
				click : fnExecCommand 
			}).button(_options.icon).appendTo(buttonPane);
		}); 
		
		if(settings.showfonts == true){
			var selectFont = $("<select/>",{
				class: 'ui-wysiwyg-select',
				data : {
					commandName : "FontName"
				},
				change : fnExecCommand
			}).appendTo(buttonPane); 
			
			$.each(settings.fonts,function(i,v){
				$("<option/>",{
					value : v,
					text : v
				}).appendTo(selectFont);
			}); 
		}
            
		buttonPane.buttonset();

		function fnGetButton(type){
			var _result = new Object;
			switch(type){
				case 'italic':
					_result.text='Italic';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-italic"}, text: false};
				break;

				case 'bold':
					_result.text='Bold';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-bold"}, text: false};
				break;

				case 'underline':
					_result.text='Underline';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-underline"}, text: false};
				break;

				case 'strikeThrough':
					_result.text='Strike';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-strike"}, text: false};
				break;

				case 'insertHorizontalRule':
					_result.text='Horizontal Rule';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-hr"}, text: false};
				break;

				case 'insertOrderedList':
					_result.text='Ordered List';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-ol"}, text: false};
				break;

				case 'insertUnorderedList':
					_result.text='Unordered List';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-ul"}, text: false};
				break;

				case 'justifyCenter':
					_result.text='Center';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-center"}, text: false};
				break;

				case 'justifyLeft':
					_result.text='Left';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-left"}, text: false};
				break;
				
				case 'justifyFull':
					_result.text='Full';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-full"}, text: false};
				break;	
				
				case 'justifyRight':
					_result.text='Right';
					_result.value='';
					_result.icon={icons: { primary: "ui-wysiwyg-icon-right"}, text: false};
				break;

				default:
					_result.text=type;
					_result.value='';
					_result.icon=null;
			}
			return _result;
		}

		function fnExecCommand (e) {
			$(this).toggleClass("selected");
			var contentWindow = editor.contentWindow;
			contentWindow.focus();
			contentWindow.document.execCommand($(this).data('commandName'), false, $(this).data('commandValue'));
			contentWindow.focus();
			return false;
		}
    });
};