<script type="text/javascript">
	
	function getQueryVariable(variable) {
		var query = decodeURIComponent(window.location.search.substring(1));
		var vars = query.split("&");
		for (var i=0;i<vars.length;i++) {
			var pair = vars[i].split("=");
			if(pair[0] == variable){return pair[1];}
		}
		return(false);
	}
	
	$(document).ready(function(){
	   $('#view').val(getQueryVariable('view'));
	   $('#view').change(function(){
	       $('#frmView').submit();
	   });
	});
	
</script>
<form class="frm" id="frmView" name="frmView" method="get" action="[[~[[*id]]]]">
	<label class="frmLabelInline" for="view">View: &nbsp;</label>
	<select id="view" name="view">
	  [[+options]]
	</select>
</form>