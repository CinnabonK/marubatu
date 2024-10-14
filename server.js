const socket = new WebSocket('ws://localhost:8080');
let currentPlayer = 'x';
const cells = document.querySelectorAll('.cell');

// WebSocketが開いた時のイベント
socket.onopen = () => {
    console.log('WebSocket connection established');
};

socket.onmessage = (event) => {
    const { index, player } = JSON.parse(event.data);
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    cell.textContent = player.toUpperCase();
    cell.classList.add(player);
};

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        // WebSocketが接続完了しているか確認
        if (socket.readyState === WebSocket.OPEN) {
            if (cell.textContent === '') {
                const index = cell.dataset.index;
                cell.textContent = currentPlayer.toUpperCase();
                cell.classList.add(currentPlayer);
                socket.send(JSON.stringify({ index, player: currentPlayer }));
                currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
            }
        } else {
            console.log('WebSocket is not open. ReadyState:', socket.readyState);
        }
    });
});
