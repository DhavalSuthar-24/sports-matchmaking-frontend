import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  UserPlus, 
  Users, 
  Trophy, 
  Shield, 
  Image as ImageIcon 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
  fetchTeamById, 
  updateTeam 
} from '@/redux/features/teams/teamThunks';
import type { AppDispatch, RootState } from '@/redux/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { Label } from '@/components/ui/label';
import MemberRoleBadge from '@/components/MemberRoleBadge';

const sports = [
  'football', 'basketball', 'volleyball', 'tennis', 'cricket',
  'hockey', 'baseball', 'rugby', 'badminton', 'table-tennis'
];

const levels = [
  'beginner', 'intermediate', 'advanced', 'professional'
];

export default function EditTeamPage() {
  const navigate = useNavigate();
  const { id: teamId } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTeam, status, error } = useSelector((state: RootState) => state.teams);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sport: '',
    minPlayers: 0,
    maxPlayers: 0,
    logo: '',
    level: '',
    socialLinks: null,
    rosterRequirements: null,
    achievements: '',
    membersToRemove: [] as string[],
    jerseyNumbers: {} as Record<string, number | null>
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (teamId) {
      dispatch(fetchTeamById(teamId));
    }
  }, [dispatch, teamId]);

  useEffect(() => {
    if (selectedTeam) {
      // Create jersey numbers map from members
      const jerseyNumbers: Record<string, number | null> = {};
      if (selectedTeam.members) {
        selectedTeam.members.forEach(member => {
          jerseyNumbers[member.userId] = member.jerseyNumber;
        });
      }

      setFormData({
        name: selectedTeam.name || '',
        description: selectedTeam.description || '',
        sport: selectedTeam.sport || '',
        minPlayers: selectedTeam.minPlayers || 0,
        maxPlayers: selectedTeam.maxPlayers || 0,
        logo: selectedTeam.logo || '',
        level: selectedTeam.level || '',
        socialLinks: selectedTeam.socialLinks,
        rosterRequirements: selectedTeam.rosterRequirements,
        achievements: selectedTeam.achievements ? JSON.stringify(selectedTeam.achievements) : '',
        membersToRemove: [],
        jerseyNumbers
      });
    }
  }, [selectedTeam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (name: string, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value);
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(numValue) ? 0 : numValue
    }));
  };

  const handleJerseyNumberChange = (userId: string, value: string) => {
    const numValue = value === '' ? null : parseInt(value);
    const jerseyNumber = isNaN(numValue as number) ? null : numValue;
    
    setFormData(prev => ({
      ...prev,
      jerseyNumbers: {
        ...prev.jerseyNumbers,
        [userId]: jerseyNumber
      }
    }));
  };

  const handleRemoveMember = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      membersToRemove: [...prev.membersToRemove, userId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamId) {
      toast.error('Invalid team ID - please return to the team page and try again');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare jersey number updates for members
      const memberUpdates = Object.entries(formData.jerseyNumbers).map(([userId, jerseyNumber]) => ({
        userId,
        jerseyNumber
      }));
      
      await dispatch(updateTeam({
        teamId: teamId,
        teamData: {
          ...formData,
          achievements: formData.achievements ? JSON.parse(formData.achievements) : null,
          minPlayers: formData.minPlayers || null,
          maxPlayers: formData.maxPlayers || null,
          memberUpdates // Pass member updates to the API
        }
      })).unwrap();
      
      toast.success('Team updated successfully');
      navigate(`/teams/${teamId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update team');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="container py-8">
        <Card className="bg-destructive/10 border-destructive/30">
          <CardHeader>
            <CardTitle>Error Loading Team</CardTitle>
            <p className="text-destructive">{error || 'Failed to load team details'}</p>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => dispatch(fetchTeamById(teamId!))}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedTeam) return null;

  return (
    <div className="container py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Team
      </Button>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Team info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Team Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sport">Sport</Label>
                    <Select
                      value={formData.sport}
                      onValueChange={(value) => handleSelectChange('sport', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sport" />
                      </SelectTrigger>
                      <SelectContent>
                        {sports.map((sport) => (
                          <SelectItem key={sport} value={sport} className="capitalize">
                            {sport}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Skill Level</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(value) => handleSelectChange('level', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map((level) => (
                          <SelectItem key={level} value={level} className="capitalize">
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minPlayers">Minimum Players</Label>
                    <Input
                      id="minPlayers"
                      name="minPlayers"
                      type="number"
                      min="1"
                      value={formData.minPlayers}
                      onChange={(e) => handleNumberChange('minPlayers', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxPlayers">Maximum Players</Label>
                    <Input
                      id="maxPlayers"
                      name="maxPlayers"
                      type="number"
                      min={formData.minPlayers || 1}
                      value={formData.maxPlayers}
                      onChange={(e) => handleNumberChange('maxPlayers', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="socialLinks">Social Links (JSON)</Label>
                  <Textarea
                    id="socialLinks"
                    name="socialLinks"
                    value={formData.socialLinks ? JSON.stringify(formData.socialLinks) : ''}
                    onChange={(e) => {
                      try {
                        const value = e.target.value ? JSON.parse(e.target.value) : null;
                        setFormData(prev => ({
                          ...prev,
                          socialLinks: value
                        }));
                      } catch {
                        // Keep the raw text if it's not valid JSON
                        setFormData(prev => ({
                          ...prev,
                          socialLinks: e.target.value === '' ? null : prev.socialLinks
                        }));
                      }
                    }}
                    rows={2}
                    placeholder='{"twitter": "https://twitter.com/team", "instagram": "https://instagram.com/team"}'
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rosterRequirements">Roster Requirements (JSON)</Label>
                  <Textarea
                    id="rosterRequirements"
                    name="rosterRequirements"
                    value={formData.rosterRequirements ? JSON.stringify(formData.rosterRequirements) : ''}
                    onChange={(e) => {
                      try {
                        const value = e.target.value ? JSON.parse(e.target.value) : null;
                        setFormData(prev => ({
                          ...prev,
                          rosterRequirements: value
                        }));
                      } catch {
                        // Keep the raw text if it's not valid JSON
                        setFormData(prev => ({
                          ...prev,
                          rosterRequirements: e.target.value === '' ? null : prev.rosterRequirements
                        }));
                      }
                    }}
                    rows={2}
                    placeholder='{"positions": ["goalkeeper", "defender", "midfielder", "striker"]}'
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="achievements">Achievements (JSON)</Label>
                  <Textarea
                    id="achievements"
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleChange}
                    rows={3}
                    placeholder='[{"year": "2023", "title": "Championship Winner"}]'
                  />
                </div>
              </CardContent>
            </Card>

            {/* Team Logo Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Team Logo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={formData.logo} alt="Team logo" />
                      <AvatarFallback>
                        <ImageIcon className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input
                      id="logo"
                      name="logo"
                      value={formData.logo}
                      onChange={handleChange}
                      placeholder="https://example.com/team-logo.jpg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Team members */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Team Members</CardTitle>
                  <Button size="sm" variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedTeam.members
                    .filter(member => !formData.membersToRemove.includes(member.userId))
                    .map((member) => (
                      <div key={member.id} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.user.profileImage || ''} />
                            <AvatarFallback>
                              {member.user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.user.name}</p>
                            <div className="flex items-center gap-2">
                              <MemberRoleBadge role={member.role} />
                              {member.isCaptain && (
                                <Badge variant="secondary">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Captain
                                </Badge>
                              )}
                              {member.position && (
                                <Badge variant="outline">
                                  {member.position}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            className="w-16"
                            placeholder="#"
                            type="number"
                            min="0"
                            value={formData.jerseyNumbers[member.userId] || ''}
                            onChange={(e) => handleJerseyNumberChange(member.userId, e.target.value)}
                          />
                          {!member.isCaptain && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveMember(member.userId)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Team Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Matches Played</span>
                  <span className="font-medium">
                    {(selectedTeam.matchHistory?.wins || 0) + 
                     (selectedTeam.matchHistory?.losses || 0) + 
                     (selectedTeam.matchHistory?.draws || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Wins</span>
                  <span className="font-medium">{selectedTeam.matchHistory?.wins || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Losses</span>
                  <span className="font-medium">{selectedTeam.matchHistory?.losses || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Draws</span>
                  <span className="font-medium">{selectedTeam.matchHistory?.draws || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Trophies</span>
                  <span className="font-medium flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    {selectedTeam.trophyCount}
                  </span>
                </div>
                {selectedTeam.sportRank && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rank in {selectedTeam.sport}</span>
                    <span className="font-medium">
                      #{selectedTeam.sportRank[selectedTeam.sport]}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <span className="font-medium">{selectedTeam.rating}</span>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}