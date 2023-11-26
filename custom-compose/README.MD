docker-compose up

# chạy docker trên windows
`Invoke-WebRequest -UseBasicParsing "https://raw.githubusercontent.com/microsoft/Windows-Containers/Main/helpful_tools/Install-DockerCE/install-docker-ce.ps1" -o install-docker-ce.ps1
.\install-docker-ce.ps1`
## Then, restart the server
# Kiểm tra Phiên bản Docker bằng cách
docker --version

# Cài docker compose
## Tạo folder C:\Program Files\Docker. Thêm folder đó vào PATH. Chạy lệnh bằng Power shell quyền admin
`[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12`
` Start-BitsTransfer -Source "https://github.com/docker/compose/releases/download/v2.23.3/docker-compose-windows-x86_64.exe" -Destination $Env:ProgramFiles\Docker\docker-compose.exe`