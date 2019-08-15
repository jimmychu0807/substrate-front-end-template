import React, {useEffect, useState} from 'react';

export default function NodeInfo(props) {
  const {api} = props;
  const [nodeInfo, setNodeInfo] = useState({})

  useEffect(() => {
    const getInfo = () => {
      Promise.all([
        api.rpc.system.chain(),
        api.rpc.system.name(),
        api.rpc.system.version(),
      ])
      .then(([chain, nodeName, nodeVersion]) => {
        setNodeInfo ({
          chain,
          nodeName,
          nodeVersion
        })
      })
      .catch((e) => console.error(e));
    }
    getInfo()
  },[api.rpc.system]);
  
  return (
    <>
      {nodeInfo.chain} - {nodeInfo.nodeName} (v{nodeInfo.nodeVersion})
      <hr/>
    </>
  )
}