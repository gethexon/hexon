import { spawn } from 'node:child_process'
import process from 'node:process'

const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'

const services = [
  {
    name: 'server',
    cwd: 'server',
    args: ['dev'],
  },
  {
    name: 'client',
    cwd: 'client',
    args: ['dev'],
  },
]

const children = []

function startService({ name, cwd, args }) {
  const child = spawn(pnpm, args, {
    cwd,
    shell: true,
    stdio: ['inherit', 'pipe', 'pipe'],
    windowsHide: false,
  })

  children.push({ name, child })

  child.stdout?.on('data', (data) => {
    process.stdout.write(`[${name}] ${data}`)
  })

  child.stderr?.on('data', (data) => {
    process.stderr.write(`[${name}] ${data}`)
  })

  child.on('error', (error) => {
    console.error(`[${name}] failed to start:`)
    console.error(error)
    shutdown(1)
  })

  child.on('exit', (code, signal) => {
    if (signal) {
      console.log(`[${name}] exited by signal ${signal}`)
    }
    else {
      console.log(`[${name}] exited with code ${code}`)
    }
  })

  return child
}

function shutdown(exitCode = 0) {
  for (const { child } of children) {
    if (!child.killed) {
      child.kill()
    }
  }

  if (exitCode !== null) {
    process.exit(exitCode)
  }
}

process.on('SIGINT', () => {
  shutdown(0)
})

process.on('SIGTERM', () => {
  shutdown(0)
})

startService(services[0])
startService(services[1])
