import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy('NFT', {
    from: deployer,
    args: ['NFT test', 'NFT1'],
    log: true
  });

  await deploy('RejectableNFT', {
    from: deployer,
    args: ['Rejectable NFT test', 'RNFT1'],
    log: true
  });
};

func.tags = ['RejectableNFT'];
export default func;
