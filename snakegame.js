export default async function (args, print, vfs, save, cwd, setCwd, setInterceptor) {
  const width = 20;
  const height = 10;
  let snake = [{ x: 5, y: 5 }];
  let food = { x: 10, y: 5 };
  let dx = 1;
  let dy = 0;
  let score = 0;
  let interval;
  let dead = false;

  function draw() {
    const grid = Array.from({ length: height }, () => Array(width).fill(' '));
    for (const s of snake) grid[s.y][s.x] = 'O';
    grid[snake[0].y][snake[0].x] = '@';
    grid[food.y][food.x] = '*';
    let lines = grid.map(row => row.join('')).join('\n');
    print(`\x1b[2J\x1b[HScore: ${score}\n${lines}`);
  }

  function move() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    if (
      head.x < 0 || head.x >= width ||
      head.y < 0 || head.y >= height ||
      snake.some(s => s.x === head.x && s.y === head.y)
    ) {
      print("💀 Game Over! Final score: " + score);
      dead = true;
      clearInterval(interval);
      setInterceptor(null);
      return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      placeFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function placeFood() {
    do {
      food = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height)
      };
    } while (snake.some(s => s.x === food.x && s.y === food.y));
  }

  function handleInput(input) {
    const key = input.trim().toLowerCase();
    if (dead) return;
    if (key === 'w' && dy !== 1) { dx = 0; dy = -1; }
    else if (key === 's' && dy !== -1) { dx = 0; dy = 1; }
    else if (key === 'a' && dx !== 1) { dx = -1; dy = 0; }
    else if (key === 'd' && dx !== -1) { dx = 1; dy = 0; }
  }

  print("Use W A S D keys to move. Press Enter after each key.\n");
  draw();
  setInterceptor(handleInput);
  interval = setInterval(move, 300);
}
