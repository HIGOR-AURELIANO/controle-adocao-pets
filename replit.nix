{ pkgs }: {
  deps = [
    pkgs.php83
    pkgs.php83Extensions.pdo
    pkgs.php83Extensions.pdo_sqlite
    pkgs.php83Extensions.sqlite3
    pkgs.php83Extensions.mbstring
    pkgs.php83Extensions.fileinfo
  ];
}
