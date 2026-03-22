import { NodeKind } from '@/types/node-types';
import { ServiceIcon } from './ServiceIcon';
import { DatabaseIcon } from './DatabaseIcon';
import { CacheIcon } from './CacheIcon';
import { QueueIcon } from './QueueIcon';
import { GatewayIcon } from './GatewayIcon';
import { UserIcon } from './UserIcon';
import { ExternalApiIcon } from './ExternalApiIcon';
import { GenericIcon } from './GenericIcon';

export const ICON_REGISTRY: Record<NodeKind, React.FC<{ size?: number }>> = {
  [NodeKind.Service]: ServiceIcon,
  [NodeKind.Database]: DatabaseIcon,
  [NodeKind.Cache]: CacheIcon,
  [NodeKind.Queue]: QueueIcon,
  [NodeKind.Gateway]: GatewayIcon,
  [NodeKind.User]: UserIcon,
  [NodeKind.ExternalApi]: ExternalApiIcon,
  [NodeKind.Generic]: GenericIcon,
};
