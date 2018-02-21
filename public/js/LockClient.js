var LockClient = function LockClient() {
};

LockClient.prototype.open = function open(data) {
  return $.ajax({
    url: '/api/open',
    method: 'POST',
    data: data,
    dataType: 'json'
  });
};

LockClient.prototype.close = function close() {
  return $.ajax({
    url: '/api/close',
    method: 'POST',
    dataType: 'json'
  });  
};

LockClient.prototype.status = function status() {
  return $.getJSON('/api/status');
};
