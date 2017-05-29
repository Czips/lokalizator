<script>
$(function() {

  $("#inputDate").datepicker({dateFormat: "dd/mm/yy"});
  });

function initMap(){
  var locations =   JSON.parse(document.getElementById('target').value);
  console.log(locations);
  var map = new google.maps.Map(document.getElementById('map'), {
  zoom: 10,
  center: new google.maps.LatLng(50.048471, 19.947245),
  mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  var infowindow = new google.maps.InfoWindow();
  var marker, i;
  for (i = 0; i < locations.length; i++) {  
  marker = new google.maps.Marker({
  position: new google.maps.LatLng(locations[i][1], locations[i][2]),
  map: map
  });
  google.maps.event.addListener(marker, 'click', (function(marker, i) {
  return function() {
  infowindow.setContent(locations[i][0]);
  infowindow.open(map, marker);
  }
  })(marker, i));
  }
}
</script>