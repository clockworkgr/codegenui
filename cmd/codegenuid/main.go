package main

import (
	"os"

	"github.com/clockworkgr/codegenui/app"
	"github.com/clockworkgr/codegenui/cmd/codegenuid/cmd"
	svrcmd "github.com/cosmos/cosmos-sdk/server/cmd"
)

func main() {
	rootCmd, _ := cmd.NewRootCmd()
	if err := svrcmd.Execute(rootCmd, app.DefaultNodeHome); err != nil {
		os.Exit(1)
	}
}
