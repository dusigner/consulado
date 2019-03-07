#!/usr/bin/env node

/*# Esse git hook irá prevenir o merge de qualquer branch com a stage
# Coloque esse arquivo no seu repositório local na pasta .git/hooks
# e garanta que está executável
# O nome do arquivo *precisa* ser "prepare-commit-msg" para o entendimento do Git.*/

'use strict';

var exec = require('child_process').exec;

var forbidden_branches = ['stage'],
	isMerge = false,
	from_branch;


if(process.argv[3] && /merge/g.test(process.argv[3])){
	isMerge = true;
}

const get_current_branch = (callback) => {
	exec("git branch | grep '*' | sed 's/* //'", (err, stdout, stderr) => {
		if(err){
			process.exit(0);
		}

		callback(stdout.replace('* ','').replace('\n',''));
	});
}

const get_merge_msg = (callback) => {
	exec("cat .git/MERGE_MSG", (err, stdout, stderr) => {
		if(err){
			process.exit(0);
		}
		callback(stdout);
	});
}

const get_from_branch = (merge_msg) => {
	return merge_msg.match(/Merge branch '(.*?)'/)[1];
}

const isForbiddenBranch = (branch) => {
	return forbidden_branches.indexOf(branch) !== -1 ? true : false;
}

const cancelMerge = (current_branch, from_branch) => {
	console.log('\n');
	console.log('*****************************');
	console.log('********* ATENÇÃO ***********');
	console.log('*****************************');
	console.log('\n');
	console.log('Você está tentando dar merge na *' + current_branch + '* com a *' + from_branch + '*.' );
	console.log('Essa ação não é permitida');
	console.log('\n');
	console.log('Rode o seguinte comando para reverter as alterações do merge:');
	console.log('\n');
	console.log('git reset --merge');
	console.log('\n');

	process.exit(1);

}


get_current_branch( (current_branch) => {
	get_merge_msg( (msg_stdout)  => {
		from_branch = get_from_branch(msg_stdout);
		if( isMerge && isForbiddenBranch(from_branch) && current_branch !== 'stage') {
			cancelMerge(current_branch, from_branch);
		}
	});

});




